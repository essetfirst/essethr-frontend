import {
  getRequest,
  postRequest,
  putRequest,
  queryObjectToString,
} from "./request";

const path = "/attendance";

function getAttendance({ query = {} } = {}) {
  // const fromDate = `${new Date(from).getFullYear()}-${new Date(from).getMonth()}-${new Date(from)}`;
  // const toDate = new Date(to).toISOString().slice(0, 10);
  // console.log("From date: ", from, fromDate);
  // console.log("To date: ", to, toDate);
  return getRequest(
    `${path}?${typeof query === "string" ? query : queryObjectToString(query)}`
  );
}

function swipe(data) {
  return postRequest(`${path}/swipe`, data);
}

function checkin(employeeId, time) {
  console.log(employeeId, time);
  return postRequest(`${path}/checkin`, { employeeId, time });
}

function checkout(employeeId, time) {
  console.log(employeeId, time);
  return postRequest(`${path}/checkout`, { employeeId, time });
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
