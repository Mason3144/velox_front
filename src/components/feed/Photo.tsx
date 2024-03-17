import {
  faBookmark,
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { FatText } from "../shared";
import Avatar from "../Avatar";
import { gql, useMutation } from "@apollo/client";
import Comments from "./Comments";
import { Link } from "react-router-dom";

const PhotoContainer = styled.div`
  background-color: white;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 60px;
  max-width: 615px;
`;
const PhotoHeader = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(239, 239, 239);
`;

const Username = styled(FatText)`
  margin-left: 15px;
`;

const PhotoFile = styled.img`
  width: 100%;
  max-width: 100%;
`;
const PhotoData = styled.div`
  padding: 12px 15px;
`;
const PhotoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;
  }
  svg {
    font-size: 20px;
  }
`;
const PhotoAction = styled.div`
  margin-right: 10px;
  cursor: pointer;
`;
const Likes = styled(FatText)`
  margin-top: 15px;
  display: block;
`;

interface User {
  avatar: string;
  username: string;
}
interface UserComments {
  id: number;
  payload: string;
  isMine: boolean;
  createdAt: string;
  user: User;
}

export interface PhotoProps {
  id: number;
  user: User;
  file: string;
  isLiked: boolean;
  likes: number;
  caption?: string;
  comments: UserComments[];
  commentNumber: number;
}

export interface Cache {
  modify: any;
  writeFragment: any;
  readFragment: any;
  evict: any;
}

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const Photo = ({
  id,
  user,
  file,
  isLiked,
  likes,
  caption,
  commentNumber,
  comments,
}: PhotoProps) => {
  const updateToggleLike = (cache: Cache, { data }: any) => {
    const {
      toggleLike: { ok },
    } = data;
    if (ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev: boolean) {
            return !prev;
          },
          likes(prev: number) {
            return isLiked ? prev - 1 : prev + 1;
          },
        },
      });

      // new feature to modify cache in Apollo3 is above
      //   cache.writeFragment({
      //     id: `Photo:${id}`,
      //     fragment: gql`
      //       fragment BSName on Photo {
      //         isLiked
      //         likes
      //       }
      //     `,
      //     data: {
      //       isLiked: !isLiked,
      //       likes: isLiked ? likes - 1 : likes + 1,
      //     },
      //   });
    }
  };
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: {
      id,
    },
    update: updateToggleLike,
  });
  return (
    <PhotoContainer key={id}>
      <PhotoHeader>
        <Link to={`/users/${user?.username}`}>
          <Avatar lg url={user.avatar} />
        </Link>
        <Link to={`/users/${user?.username}`}>
          <Username>{user.username}</Username>
        </Link>
      </PhotoHeader>
      <PhotoFile src={file} />
      <PhotoData>
        <PhotoActions>
          <div>
            <PhotoAction onClick={() => toggleLikeMutation()}>
              <FontAwesomeIcon
                style={{ color: isLiked ? "tomato" : "inherit" }}
                icon={isLiked ? SolidHeart : faHeart}
              />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon icon={faComment} />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon icon={faPaperPlane} />
            </PhotoAction>
          </div>
          <div>
            <FontAwesomeIcon icon={faBookmark} />
          </div>
        </PhotoActions>
        <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
        <Comments
          photoId={id}
          author={user.username}
          caption={caption}
          comments={comments}
          commentNumber={commentNumber}
        ></Comments>
      </PhotoData>
    </PhotoContainer>
  );
};

export default Photo;
