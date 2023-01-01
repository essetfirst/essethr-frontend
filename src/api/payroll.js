import {
  postRequest,
  getRequest,
  putRequest,
  deleteRequest,
  queryObjectToString,
} from "./request";

const payrollPath = "payrolls";
const payrolls = {
  generate: function (payrollMetaData) {
    return postRequest(`${payrollPath}/generate`, payrollMetaData);
  },
  getPayrollHours: function ({ query = {}, page, limit } = {}) {
    return getRequest(
      `${payrollPath}/get-payroll-hours?${
        typeof query === "string" ? query : queryObjectToString(query)
      }&page=${page}&limit=${limit}`
    );
  },
  getAll: function ({ query = {}, page, limit } = {}) {
    return getRequest(
      `${payrollPath}?${
        typeof query === "string" ? query : queryObjectToString(query)
      }&page=${page}&limit=${limit}`
    );
  },
  getById: function (payrollId) {
    return getRequest(`${payrollPath}/${payrollId}`);
  },
  updateById: function (payrollId, update) {
    return putRequest(`${payrollPath}/${payrollId}`, update);
  },
  deleteById: function (payrollId) {
    return deleteRequest(`${payrollPath}/${payrollId}`);
  },

  getReport: function ({ query = {} }) {
    return getRequest(
      `${payrollPath}/report?${
        typeof query === "string" ? query : queryObjectToString(query)
      }`
    );
  },
};

const payslipPath = "/payslips";
const payslips = {
  create: function (payslipData) {
    return postRequest(payslipPath, payslipData);
  },
  getAll: function ({ query, page, limit }) {
    return getRequest(
      `${payslipPath}?${
        typeof query === "string" ? query : queryObjectToString(query)
      }&page=${page}&limit=${limit}`
    );
  },
  getById: function (payslipId) {
    return getRequest(`${payslipPath}/${payslipId}`);
  },
  updateById: function (payslipId, update) {
    return putRequest(`${payrollPath}/${payslipId}`, update);
  },
  deleteById: function (payslipId) {
    return deleteRequest(`${payrollPath}/${payslipId}`);
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ...payrolls,
  payslips,
};
