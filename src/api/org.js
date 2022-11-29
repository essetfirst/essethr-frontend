import {
  // default as request,
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
  queryObjectToString,
} from "./request";

const orgsPath = "orgs";

const orgs = {
  getAll: function ({ query = {}, page, limit } = {}) {
    return getRequest(
      `${orgsPath}?${
        typeof query === "string" ? query : queryObjectToString(query)
      }&page=${page}&limit=${limit}`
    );
  },
  getById: function (id) {
    return getRequest(`${orgsPath}/${id}`);
  },
  getBySlug: function (slug) {
    return getRequest(`${orgsPath}?slug=${slug}`);
  },
  create: function (data) {
    return postRequest(`${orgsPath}`, data);
  },
  editById: function (id, data) {
    return putRequest(`${orgsPath}/${id}`, data);
  },
  getAttendancePolicy: function (id) {
    return getRequest(`${orgsPath}/${String(id)}/attendance-policy`);
  },
  updateAttendancePolicy: function (id, update) {
    return putRequest(`${orgsPath}/${String(id)}/attendance-policy`, update);
  },
  resetAttendancePolicy: function (id, update) {
    return postRequest(
      `${orgsPath}/${String(id)}/reset-attendance-policy`,
      update
    );
  },
  deleteById: function (id) {
    deleteRequest(`${orgsPath}/${id}`);
  },
  deleteAll: function () {
    deleteRequest(`${orgsPath}`);
  },
};

const getFullDepartmentPath = (org, id) =>
  `orgs/${org}/departments${id ? "/" + id : ""}`;

const departments = {
  get: function (org) {
    return getRequest(getFullDepartmentPath(org));
  },
  getById: function (org, id) {
    return getRequest(getFullDepartmentPath(org, id));
  },
  create: function (org, data) {
    return postRequest(getFullDepartmentPath(org), data);
  },
  editById: function (org, id, data) {
    return putRequest(getFullDepartmentPath(org, id), data);
  },
  deleteById: function (org, id) {
    return deleteRequest(getFullDepartmentPath(org, id));
  },
  deleteAll: function (org) {
    return deleteRequest(getFullDepartmentPath(org));
  },
};

const getFullPositionPath = (org, id) =>
  `orgs/${org}/positions${id ? "/" + id : ""}`;

const positions = {
  get: function (org) {
    return getRequest(getFullPositionPath(org));
  },
  getById: function (org, id) {
    return getRequest(getFullPositionPath(org, id));
  },
  create: function (org, data) {
    return postRequest(getFullPositionPath(org), data);
  },
  editById: function (org, id, data) {
    return putRequest(getFullPositionPath(org, id), data);
  },
  deleteById: function (org, id) {
    return deleteRequest(getFullPositionPath(org, id));
  },
  deleteAll: function (org) {
    return deleteRequest(getFullPositionPath(org));
  },
};

const getFullLeaveTypePath = (org, id) =>
  `orgs/${org}/leave-types${id ? "/" + id : ""}`;

const leaveTypes = {
  get: function (org) {
    return getRequest(getFullLeaveTypePath(org));
  },
  getById: function (org, id) {
    return getRequest(getFullLeaveTypePath(org, id));
  },
  add: function (org, data) {
    return postRequest(getFullLeaveTypePath(org), data);
  },
  editById: function (org, id, data) {
    return putRequest(getFullLeaveTypePath(org, id), data);
  },
  deleteById: function (org, id) {
    return deleteRequest(getFullLeaveTypePath(org, id));
  },
  deleteAll: function (org) {
    return deleteRequest(getFullLeaveTypePath(org));
  },
};

const getFullHolidayPath = (org, id) =>
  `orgs/${org}/holidays${id ? "/" + id : ""}`;

const holidays = {
  get: function (org) {
    return getRequest(getFullHolidayPath(org));
  },
  getById: function (org, id) {
    return getRequest(getFullHolidayPath(org, id));
  },
  add: function (org, data) {
    return postRequest(getFullHolidayPath(org), data);
  },
  editById: function (org, id, data) {
    return putRequest(getFullHolidayPath(org, id), data);
  },
  deleteById: function (org, id) {
    return deleteRequest(getFullHolidayPath(org, id));
  },
  deleteAll: function (org) {
    return deleteRequest(getFullHolidayPath(org));
  },
};

const orgApi = {
  ...orgs,
  departments,
  positions,
  leaveTypes,
  holidays,
};

export default orgApi;
