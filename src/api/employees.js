import {
  deleteRequest,
  getRequest,
  postRequest,
  postRequestFileUpload,
  putRequest,
  putRequestFileUpload,
  queryObjectToString,
} from "./request";

// API URL
const path = "employees";

function getAll({ query = {} } = {}) {
  return getRequest(
    `${path}?${typeof query === "string" ? query : queryObjectToString(query)}`
  );
}

function getById(id) {
  return getRequest(`${path}/${id}`);
}

function getDetails(id) {
  return getRequest(`${path}/${id}/details`);
}

function create(data) {
  return postRequestFileUpload(`${path}`, data);
}

function editById(id, data) {
  return putRequestFileUpload(`${path}/${id}`, data);
}

function uploadImage(id, imageFile) {
  const onUploadProgress = () => {};
  let formData = new FormData();

  formData.append("file", imageFile);

  return putRequest(`${path}/${id}/upload-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
}

function importEmployees(employees) {
  return postRequest(`${path}/import`, employees);
}

function deleteById(id) {
  return deleteRequest(`${path}/${id}`);
}

function deleteAll() {
  return deleteRequest(`${path}`);
}

function getReport({ query = {} }) {
  return getRequest(
    `${path}/report?${
      typeof query === "string" ? query : queryObjectToString(query)
    }`
  );
}

const employeesApi = {
  getAll,
  getById,
  getDetails,
  create,
  editById,
  uploadImage,
  importEmployees,
  deleteById,
  deleteAll,
  getReport,
};

export default employeesApi;
