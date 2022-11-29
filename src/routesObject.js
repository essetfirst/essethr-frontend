import React from "react";
import { Navigate, Outlet, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import MainLayout from "./layouts/MainLayout";

import OrganizationView from "./views/org/OrganizationView";

import AccountView from "./views/account/AccountView";

import AttendanceView from "./views/attendance";

import DashboardView from "./views/reports/DashboardView";

import EmployeeCreateView from "./views/employees/EmployeeCreateView";
import EmployeeEditView from "./views/employees/EmployeeEditView";
import EmployeeListView from "./views/employees/EmployeeListView";
import EmployeeProfileView from "./views/employees/EmployeeProfileView";

import LeaveManagementView from "./views/leaves/LeaveManagementView";

import PayrollDetailsView from "./views/payroll/PayrollDetailsView";
import PayrollGenerateView from "./views/payroll/PayrollGenerateView";
import PayrollListView from "./views/payroll/PayrollListView";
import PayslipDetailsView from "./views/payroll/PayslipDetailsView";

import ReportView from "./views/reports/ReportView";
import PayrollHoursView from "./views/reports/PayrollHoursView";
import SettingsView from "./views/settings/SettingsView";

import RegisterView from "./views/auth/RegisterView";
import LoginView from "./views/auth/LoginView";
import NotFoundView from "./views/errors/NotFoundView";
import SignUp from "./views/auth/SignUpView";

const routes = [
  {
    path: "/app",
    isProtected: true,
    element: <DashboardLayout />,
    children: [
      { path: "/", exact: true, element: <Navigate to={"/dashboard"} /> },
      { path: "account", element: <AccountView /> },
      { path: "attendance", element: <AttendanceView /> },
      { path: "dashboard", element: <DashboardView /> },
      {
        path: "employees",
        element: <Outlet />,
        children: [
          { path: "/", exact: true, element: <EmployeeListView /> },
          { path: "new", exact: true, element: <EmployeeCreateView /> },
          { path: "edit/:id", exact: true, element: <EmployeeEditView /> },
          { path: ":id", element: <EmployeeProfileView /> },
        ],
      },
      {
        path: "leaves",
        element: <LeaveManagementView />,
      },
      {
        path: "payroll",
        element: <Outlet />,
        children: [
          { path: "/", exact: true, element: <PayrollListView /> },
          { path: "generate", element: <PayrollGenerateView /> },
          { path: ":id", element: <PayrollDetailsView /> },
        ],
      },
      {
        path: "payslips",
        element: <Outlet />,
        children: [{ path: ":id", element: <PayslipDetailsView /> }],
      },
      {
        path: "org",
        element: <OrganizationView />,
      },
      {
        path: "reports",
        element: <Outlet />,
        children: [
          { path: "/", exact: true, element: <ReportView /> },
          { path: "/payroll-hours", element: <PayrollHoursView /> },
        ],
      },
      {
        path: "settings",
        element: <SettingsView />,
      },
      {
        path: "*",
        element: <Navigate to={"/404"} />,
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "login", element: <LoginView /> },
      { path: "signup", element: <SignUp /> },
      { path: "404", element: <NotFoundView /> },
      { path: "*", element: <Navigate to={"/404"} /> },
    ],
  },
];

function MyRoute({ isProtected, element, children, ...rest }) {
  const childrenRoutes = children ? children.map(MyRoute) : null;
  return (
    <Route
      {...rest}
      element={isProtected && !isAuth ? <Navigate to={"/login"} /> : element}
    >
      {childrenRoutes}
    </Route>
  );
}

const MyRoutes = routes.map(MyRoute);

export default MyRoutes;
