import authApi from "./auth";
import employeesApi from "./employees";
import attendanceApi from "./attendance";
import leavesApi from "./leaves";
import payrollApi from "./payroll";
import orgApi from "./org";
import usersApi from "./users";

const API = {
  auth: authApi,
  employees: employeesApi,
  attendance: attendanceApi,
  leaves: leavesApi,
  payroll: payrollApi,

  orgs: orgApi,
  users: usersApi,
};

export default API;
