import authApi from "features/auth/api";
import employeesApi from "features/employees/api";
import attendanceApi from "features/attendance/api";
import leavesApi from "features/leaves/api";
import payrollApi from "features/payroll/api";
import orgApi from "features/org/api";
import usersApi from "features/users/api";
import auditApi from "features/audit/api";
import settingsApi from "features/settings/api";
import documentsApi from "features/documents/api";

const API = {
  auth: authApi,
  employees: employeesApi,
  attendance: attendanceApi,
  leaves: leavesApi,
  payroll: payrollApi,

  orgs: orgApi,
  users: usersApi,
  audit: auditApi,
  settings: settingsApi,
  documents: documentsApi,
};

export default API;
