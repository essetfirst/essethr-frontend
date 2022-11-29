import { postRequest } from "./request";

const authPath = "/auth";

//For Employee Register and Login
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

export default {
  signup,
  signin,
  signout,

  register,
  login,
  logout,
};
