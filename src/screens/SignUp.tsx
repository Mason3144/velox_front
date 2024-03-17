import { gql, useMutation } from "@apollo/client";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import AuthLayout from "../components/auth/AuthLayout";
import BottomBox from "../components/auth/BottomBox";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import FormError from "../components/auth/FormError";
import Input from "../components/auth/input";
import PageTitle from "../components/PageTitle";
import { FatLink } from "../components/shared";
import routes from "../routes";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
`;

interface FormData {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  signUpResult?: string;
}

const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccount(
    $firstName: String!
    $username: String!
    $email: String!
    $password: String!
    $lastName: String
  ) {
    createAccount(
      firstName: $firstName
      username: $username
      email: $email
      password: $password
      lastName: $lastName
    ) {
      ok
      error
    }
  }
`;

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setError,
    clearErrors,
  } = useForm<FormData>({
    mode: "all",
  });
  const { username, password, lastName, firstName, email } = getValues();
  const history = useHistory();
  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted: ({ createAccount: { ok, error } }) => {
      if (!ok) {
        return setError("signUpResult", { message: error });
      } else {
        history.push(routes.home, {
          message: "Account created. Please log in",
          username,
          password,
        });
      }
    },
  });

  const onSubmitValid = () => {
    if (loading) {
      return;
    }

    createAccount({
      variables: { username, password, lastName, firstName, email },
    });
  };
  return (
    <AuthLayout>
      <PageTitle title="Sign Up"></PageTitle>
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtitle>
            Sign up to see photos and videos from your friends.
          </Subtitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("firstName", {
              required: "First name is required",
              onChange() {
                clearErrors("signUpResult");
              },
            })}
            type="text"
            placeholder="First name"
            hasError={Boolean(formState.errors?.firstName?.message)}
          />
          <FormError message={formState.errors?.firstName?.message}></FormError>
          <Input
            {...register("lastName", {})}
            type="text"
            placeholder="Last name"
            hasError={Boolean(formState.errors?.lastName?.message)}
          />
          <FormError message={formState.errors?.lastName?.message}></FormError>
          <Input
            {...register("email", {
              required: "Email is required",
              onChange() {
                clearErrors("signUpResult");
              },
            })}
            type="text"
            placeholder="Email"
            hasError={Boolean(formState.errors?.email?.message)}
          />
          <FormError message={formState.errors?.email?.message}></FormError>
          <Input
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username should be longer than 3 chars",
              },
              onChange() {
                clearErrors("signUpResult");
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
                clearErrors("signUpResult");
              },
            })}
            type="password"
            placeholder="Password"
            hasError={Boolean(formState.errors?.password?.message)}
          />
          <FormError message={formState.errors?.password?.message}></FormError>
          <Button
            type="submit"
            value={loading ? "Loading..." : "Sign up"}
            disabled={!formState.isValid || loading}
          />
          <FormError
            message={formState.errors?.signUpResult?.message}
          ></FormError>
        </form>
      </FormBox>
      <BottomBox cta="Have an account?" linkText="Log in" link={routes.home} />
    </AuthLayout>
  );
};

export default SignUp;
