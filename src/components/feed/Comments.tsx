import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import useUser from "../../hooks/useUser";
import Comment from "./Comment";
import { Cache } from "./Photo";

const CommentsContainer = styled.div`
  margin-top: 20px;
`;

const CommentCount = styled.span`
  opacity: 0.7;
  margin: 10px 0;
  display: block;
  font-weight: 600;
  font-size: 12px;
`;

const PostCommentContainer = styled.div`
  margin-top: 10px;
  padding-top: 15px;
  padding-bottom: 10px;
  border-top: 1px solid ${(props) => props.theme.borderColor};
`;

const PostCommentInput = styled.input`
  width: 100%;
  &::placeholder {
    font-size: 12px;
  }
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

interface IProps {
  author: string;
  caption?: string;
  comments: UserComments[];
  commentNumber: number;
  photoId: number;
}

interface CommentCache {
  __ref: string;
}

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      error
      id
    }
  }
`;

const Comments = ({
  author,
  caption,
  commentNumber,
  comments,
  photoId,
}: IProps) => {
  const { data: userData } = useUser();
  const { register, handleSubmit, setValue, getValues } = useForm();
  const createCommentUpdate = (cache: Cache, { data }: any) => {
    const { payload } = getValues();
    setValue("payload", "");
    const {
      createComment: { ok, id },
    } = data;

    if (ok && userData?.me) {
      const newComment = {
        __typename: "Comment",
        createdAt: Date.now() + "",
        id,
        isMine: true,
        payload,
        user: {
          ...userData.me,
        },
        //cache에 있는 photoId를 제외한 모든항목들을 fake로 만들어줌
        //(backend에서 값을 불러오는게 정확하나 브라우저에서 보여주기만하면 되므로 fake로 만듬)
        //setValue로 payload리셋을 getValue 후에 와야됨(그렇지않으면 cache의 payload는 empty가 됨)
        //useMutation은 cache 작업 후에 불러오기(안그러면 type error가 뜸)
      };
      const newCacheComment = cache.writeFragment({
        data: newComment,
        fragment: gql`
          fragment BSName on Comment {
            id
            createdAt
            isMine
            payload
            user {
              username
              avatar
            }
          }
        `,
      });
      //SQL DB와 비슷하게 cache에 comment를 생성후 포토에는 그 comment의 id만 ref로 남기기
      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          comments(pre: CommentCache[]) {
            return [...pre, newCacheComment];
          },
          commentNumber(pre: number) {
            return pre + 1;
          },
        },
      });
    }
  };

  const [createCommentMutation, { loading }] = useMutation(
    CREATE_COMMENT_MUTATION,
    { update: createCommentUpdate }
  );

  const onValid = ({ payload }: any) => {
    if (loading) {
      return;
    }
    createCommentMutation({
      variables: { photoId, payload },
    });
  };
  return (
    <CommentsContainer>
      <Comment author={author} caption={caption} />
      <CommentCount>
        {commentNumber === 1 ? "1 comment" : `${commentNumber} comments`}
      </CommentCount>
      {comments?.map((comment) => (
        <Comment
          key={comment.id}
          id={comment.id}
          author={comment.user.username}
          caption={comment.payload}
          isMine={comment.isMine}
          photoId={photoId}
        />
      ))}
      <PostCommentContainer>
        <form onSubmit={handleSubmit(onValid)}>
          <PostCommentInput
            {...register("payload", { required: true })}
            type="text"
            placeholder="Comment here"
          ></PostCommentInput>
        </form>
      </PostCommentContainer>
    </CommentsContainer>
  );
};
export default Comments;
