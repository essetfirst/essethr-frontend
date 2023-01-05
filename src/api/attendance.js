/* eslint-disable import/no-anonymous-default-export */
import {
  getRequest,
  postRequest,
  putRequest,
  queryObjectToString,
} from "./request";

const path = "/attendance";

function getAttendance(query = {}) {
  return getRequest(
    `${path}/all?${
      typeof query === "string" ? query : queryObjectToString(query)
    }`
  );
}

function swipe(data) {
  return postRequest(`${path}/swipe`, data);
}

function checkin(employeeId) {
  return postRequest(`${path}/checkin`, { employeeId });
}

function checkout(employeeId) {
  return postRequest(`${path}/checkout`, { employeeId });
}

function approveAttendance(data) {
  return putRequest(`${path}/approve-attendance`, data);
}

function updateAttendance(data) {
  return putRequest(`${path}/update-attendance`, data);
}

function getReport({ query = {} }) {
  return getRequest(
    `${path}/report?${
      typeof query === "string" ? query : queryObjectToString(query)
    }`
  );
}

export default {
  getAttendance,
  swipe,
  checkin,
  checkout,
  approveAttendance,
  updateAttendance,
  getReport,
};
