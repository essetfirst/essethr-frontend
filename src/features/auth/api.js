import { getRequest, postRequest } from "api/request";

//For Admin Login And register

const authPath = "/auth";

function signup(payload) {
  return postRequest(`${authPath}/signup`, payload);
}

function signin(payload) {
  return postRequest(`${authPath}/signin`, payload);
}

function signout() {
  return postRequest(`${authPath}/signout`);
}

//For Supervisor Login And Register

const usersPath = "users";

function register(payload) {
  return postRequest(`${usersPath}/register`, payload);
}

function login(payload) {
  return postRequest(`${usersPath}/login`, payload);
}

function logout() {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  return postRequest(`${usersPath}/logout`, { refreshToken: auth.refreshToken });
}

function me(options) {
  return getRequest(`${authPath}/me`, null, options);
}

function refresh(refreshToken) {
  return postRequest(`${usersPath}/refresh`, { refreshToken });
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  signup,
  signin,
  signout,

  register,
  login,
  logout,
  refresh,
  me,
};
