import { postRequest } from "./request";

const authPath = "/auth";

//For Supervisor Login And Register
function signup(payload) {
  return postRequest(`${authPath}/signup`, payload);
}

function signin(payload) {
  return postRequest(`${authPath}/signin`, payload);
}

function signout() {
  return postRequest(`${authPath}/signout`);
}

const usersPath = "/users";

//For Admin Login And register
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
