import {
  deleteRequest,
  getRequest,
  putRequest,
  postRequest,
  queryObjectToString,
} from "./request";

const path = "/users";

function getAll({ query = {}, page, limit } = {}) {
  return getRequest(
    `${path}?${
      typeof query === "string" ? query : queryObjectToString(query)
    }&page=${page}&limit=${limit}`
  );
}

function createEmployeeUser(data) {
  return postRequest(`${path}`, data);
}

function getById(id) {
  return getRequest(`${path}/${id}`);
}

function editById(id, update) {
  return putRequest(`${path}/${id}`, update);
}

function deleteById(id) {
  return deleteRequest(`${path}/${id}`);
}

function deleteAll() {
  return deleteRequest(path);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  createEmployeeUser,
  getAll,
  getById,
  editById,
  deleteById,
  deleteAll,
};
