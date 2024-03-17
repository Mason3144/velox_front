import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { PHOTO_FRAGMENT } from "../fragments";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { FatText } from "../components/shared";
import Button from "../components/auth/Button";
import PageTitle from "../components/PageTitle";
import useUser from "../hooks/useUser";

const Header = styled.div`
  display: flex;
`;
const Avatar = styled.img`
  margin-left: 50px;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-right: 150px;
  background-color: #2c2c2c;
`;
const Column = styled.div``;
const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;
const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  display: flex;
`;
const List = styled.ul`
  display: flex;
`;
const Item = styled.li`
  margin-right: 20px;
`;
const Value = styled(FatText)`
  font-size: 18px;
`;
const Name = styled(FatText)`
  font-size: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
`;

interface IProps {
  bg: string;
}

const Photo = styled.div<IProps>`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
`;

const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0px 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;

const ProfileBtn = styled(Button).attrs({ as: "span" })`
  margin-left: 10px;
  margin-top: 0px;
`;

const UnFollowBtn = styled(ProfileBtn)`
  background-color: gray;
  opacity: 0.8;
`;

interface Params {
  username: string;
}
interface IPhoto {
  file: string;
  likes: number;
  commentNumber: number;
  id: number;
}

interface SeeProfile {
  id?: number;
  isMe?: boolean;
  isFollowing?: boolean;
  username?: string;
  avatar?: string;
  totalFollowers?: number;
  totalFollowing?: number;
  firstName?: string;
  lastName?: string;
  bio?: string;
  photos?: IPhoto;
}

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      id
      isMe
      isFollowing
      totalFollowers
      totalFollowing
      avatar
      bio
      username
      lastName
      firstName
      photos {
        ...PhotoFragment
      }
    }
  }
  ${PHOTO_FRAGMENT}
`;

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($username: String) {
    followUser(username: $username) {
      ok
      error
    }
  }
`;

const Profile = () => {
  const { username }: Params = useParams();
  const myData = useUser();
  const isFollowUpdate = (cache: any, { data }: any) => {
    const {
      followUser: { ok },
    } = data;
    if (ok) {
      const { isFollowing } = cache.readFragment({
        id: `User:${username}`,
        fragment: gql`
          fragment BSName on User {
            isFollowing
          }
        `,
      });
      cache.modify({
        id: `User:${username}`,
        fields: {
          isFollowing(pre: boolean) {
            return !pre;
          },
          totalFollowers(pre: number) {
            if (isFollowing) {
              return pre - 1;
            } else {
              return pre + 1;
            }
          },
        },
      });
      cache.modify({
        id: `User:${myData?.data?.me?.username}`,
        fields: {
          totalFollowing(pre: number) {
            if (isFollowing) {
              return pre - 1;
            } else {
              return pre + 1;
            }
          },
        },
      });
    }
  };

  const { data, loading }: any = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username,
    },
  });
  const [followUser] = useMutation(FOLLOW_USER_MUTATION, {
    variables: { username },
    update: isFollowUpdate,
  });

  const getButton = ({ isMe, isFollowing }: SeeProfile) => {
    if (isMe) {
      return <ProfileBtn>Edit Profile</ProfileBtn>;
    }
    if (isFollowing) {
      return <ProfileBtn onClick={() => followUser()}>Following</ProfileBtn>;
    } else {
      return (
        <UnFollowBtn onClick={() => followUser()}>Unfollowing</UnFollowBtn>
      );
    }
  };

  return (
    <div>
      <PageTitle
        title={
          loading ? "Loading..." : `${data?.seeProfile?.username}'s Profile`
        }
      ></PageTitle>
      <Header>
        <Avatar src={data?.seeProfile?.avatar} />
        <Column>
          <Row>
            <Username>{data?.seeProfile?.username}</Username>
            {data?.seeProfile ? getButton(data.seeProfile) : null}
          </Row>
          <Row>
            <List>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowers}</Value> followers
                </span>
              </Item>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowing}</Value> following
                </span>
              </Item>
            </List>
          </Row>
          <Row>
            <Name>
              {data?.seeProfile?.firstName}
              {"  "}
              {data?.seeProfile?.lastName}
            </Name>
          </Row>
          <Row>{data?.seeProfile?.bio}</Row>
        </Column>
      </Header>
      <Grid>
        {data?.seeProfile?.photos.map((photo: IPhoto) => (
          <Photo key={photo.id} bg={photo.file}>
            <Icons>
              <Icon>
                <FontAwesomeIcon icon={faHeart} />
                {photo.likes}
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faComment} />
                {photo.commentNumber}
              </Icon>
            </Icons>
          </Photo>
        ))}
      </Grid>
    </div>
  );
};

export default Profile;
