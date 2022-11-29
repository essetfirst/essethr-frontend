import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
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
  return postRequest(`${path}`, data);
}

function editById(id, data) {
  return putRequest(`${path}/${id}`, data);
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

// function getEmployees(page, limit) {
//   return request(`${path}?page=${page}&limit=${limit}`);
// }

// function getEmployeeById(id) {
//   return request(`${path}/${id}`);
// }

// function createEmployee(employeeData) {
//   return request(path, {
//     method: "POST",
//     body: JSON.stringify(employeeData),
//   });
// }

// function editEmployee(employeeData) {
//   return request(`${path}/${id}`, {
//     method: "PATCH",
//     body: JSON.stringify(employeeData),
//   });
// }

// function deleteEmployee(id) {
//   return request(`${path}/${id}`, { method: "DELETE" });
// }

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
  // getEmployees,
  // getEmployeeById,
  // createEmployee,
  // editEmployee,
  // deleteEmployee,
};

export default employeesApi;
