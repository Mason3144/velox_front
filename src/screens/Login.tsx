import { gql, useMutation } from "@apollo/client";
import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { logUserIn } from "../apollo";
import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import FormError from "../components/auth/FormError";
import Input from "../components/auth/input";
import Separator from "../components/auth/Separator";
import PageTitle from "../components/PageTitle";
import routes from "../routes";

const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;
const Notification = styled.div`
  color: #2ecc71;
`;

interface FormData {
  username: string;
  password: string;
  loginResult?: string;
  message?: string;
}
// interface Location {
//   message: string;
//   username: string;
//   password: string;
// }

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

const Login = () => {
  const { state } = useLocation<FormData>();
  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setError,
    clearErrors,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      username: state?.username || "",
      password: state?.password || "",
    },
  });

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: ({ login: { ok, error, token } }) => {
      if (!ok) {
        return setError("loginResult", { message: error });
      } else {
        logUserIn(token);
      }
    },
  });
  const onSubmitValid = () => {
    if (loading) {
      return;
    }
    const { username, password } = getValues();
    login({
      variables: { username, password },
    });
  };
  return (
    <AuthLayout>
      <PageTitle title="Log in" />
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <Notification>{state?.message}</Notification>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username should be longer than 3 chars",
              },
              onChange() {
                clearErrors("loginResult");
              },
            })}
            type="text"
            placeholder="Username"
            hasError={Boolean(formState.errors?.username?.message)}
          />
          <FormError message={formState.errors?.username?.message}></FormError>
          <Input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 3,
                message: "Username should be longer than 3 chars",
              },
              onChange() {
                clearErrors("loginResult");
              },
            })}
            type="password"
            placeholder="Password"
            hasError={Boolean(formState.errors?.password?.message)}
          />

          <FormError message={formState.errors?.password?.message}></FormError>
          <Button
            type="submit"
            value={loading ? "Loading..." : "Log in"}
            disabled={!formState.isValid || loading}
          />
          <FormError
            message={formState.errors?.loginResult?.message}
          ></FormError>
        </form>
        <Separator />
        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>Log in with Facebook</span>
        </FacebookLogin>
      </FormBox>
      <BottomBox
        cta="Don't have an account?"
        linkText="Sign up"
        link={routes.signUp}
      />
    </AuthLayout>
  );
};

export default Login;
