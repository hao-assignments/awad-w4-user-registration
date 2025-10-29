import api, { apiAuth } from "@/services/kyInstance";

const localStorageTokenKey = "auth_client_token";

export type AuthInfo = {
  accessToken: string;
};

type SignInParams = {
  email: string;
  password: string;
};

type SignUpParams = {
  username: string;
  email: string;
  password: string;
};

export type AuthUser = {
  username: string;
  email: string;
};

export const getAuthValueFromStorage = () => {
  return localStorage.getItem(localStorageTokenKey)
    ? (JSON.parse(localStorage.getItem(localStorageTokenKey) ?? "") as AuthInfo)
    : null;
};

export const signIn = async (params: SignInParams) => {
  const data = await apiAuth.post("login", { json: params }).json<AuthInfo>();
  localStorage.setItem(localStorageTokenKey, JSON.stringify(data));
  return data;
};

export const signUp = async (params: SignUpParams) => {
  const data = await apiAuth.post("register", { json: params }).json<AuthInfo>();
  return data;
};

export const signOut = () => {
  localStorage.removeItem(localStorageTokenKey);
  return Promise.resolve();
};

export const getUser = async () => {
  return api.get("profile").json<AuthUser>();
};
