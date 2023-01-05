import { postRequest } from "./request";

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
  return postRequest(`${usersPath}/logout`);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  signup,
  signin,
  signout,

  register,
  login,
  logout,
};
