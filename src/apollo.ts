import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import routes from "./routes";

const TOKEN = "token";
const DARK_MODE = "DARK_MODE";

export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));
export const logUserIn = (token: string) => {
  localStorage.setItem(TOKEN, token);
  isLoggedInVar(true);
};
export const logUserOut = (history?: any) => {
  localStorage.removeItem(TOKEN);
  isLoggedInVar(false);
  history?.replace({ pathname: routes.home, state: null });
};

export const darkModeVar = makeVar(Boolean(localStorage.getItem(DARK_MODE)));

export const enableDarkMode = () => {
  localStorage.setItem(DARK_MODE, "enabled");
  darkModeVar(true);
};

export const disableDarkMode = () => {
  localStorage.removeItem(DARK_MODE);
  darkModeVar(false);
};

const httpLink = createHttpLink({
  uri: process.env.NODE_ENV==="production"? "https://instagram-clone-coding-backend.herokuapp.com/graphql":"http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      token,
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        keyFields: (obj) => `User:${obj.username}`,
        //cache안의 User의 고유식별자를 username으로 지정(default값은 id)
        //Home안의 post uploader의 id가 없고 username만 불러오게 하였으므로 cache의 설정을 바꿔
        //uploader를 cache에서 식별하게함(uploader의 id를 불러오게하면 이처럼 따로 chache 설정을 바꿀필요없음)
      },
    },
  }),
});
