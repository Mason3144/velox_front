import { gql, useQuery } from "@apollo/client";
import Photo from "../components/feed/Photo";
import PageTitle from "../components/PageTitle";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";

const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      user {
        username
        avatar
      }
      caption
      createdAt
      isMine
      ...PhotoFragment
      comments {
        ...CommentFragment
      }
    }
  }
  ${COMMENT_FRAGMENT}
  ${PHOTO_FRAGMENT}
`;

const Home = () => {
  const { data } = useQuery(FEED_QUERY);
  return (
    <div>
      <PageTitle title="Home"></PageTitle>
      {data?.seeFeed?.map((photo: any) => (
        <Photo
          key={photo.id}
          {...photo} //same as below
          // id={photo.id}
          // user={photo.user}
          // file={photo.file}
          // isLiked={photo.isLiked}
          // likes={photo.likes}
        ></Photo>
      ))}
    </div>
  );
};
export default Home;

//<button onClick={() => logUserOut(history)}>Log out!</button>
