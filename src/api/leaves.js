import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  queryObjectToString,
} from "./request";

// const path = "/leaves";
const leavesPath = "/leaves";
const leaves = {
  add: function (leaveData) {
    return postRequest(leavesPath, leaveData);
  },
  getAll: function ({ query = {}, page, limit } = {}) {
    return getRequest(
      `${leavesPath}?${
        typeof query === "string" ? query : queryObjectToString(query)
      }&page=${page}&limit=${limit}`
    );
  },
  getById: function (leaveId) {
    return getRequest(`${leavesPath}/${leaveId}`);
  },
  approve: function (leaveIds) {
    return putRequest(`${leavesPath}/approve`, { leaveIds });
  },
  updateById: function (leaveId, update) {
    return putRequest(`${leavesPath}/${leaveId}`, update);
  },
  deleteById: function (leaveId) {
    return deleteRequest(`${leavesPath}/${leaveId}`);
  },

  getReport: function ({ query = {} }) {
    return getRequest(
      `${leavesPath}/report?${
        typeof query === "string" ? query : queryObjectToString(query)
      }`
    );
  },
};

const allowancesPath = "/leaves/allowances";
const allowances = {
  allocate: function (allowanceData) {
    return postRequest(`${allowancesPath}/allocate`, allowanceData);
  },
  getAll: function () {
    return getRequest(`${allowancesPath}`);
  },
  getById: function (allowanceId) {
    return getRequest(`${allowancesPath}/${allowanceId}`);
  },
  updateById: function (allowanceId, update) {
    return putRequest(`${allowancesPath}/${allowanceId}`, update);
  },
  deleteById: function (allowanceId) {
    return deleteRequest(`${allowancesPath}/${allowanceId}`);
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ...leaves,
  allowances,
};
