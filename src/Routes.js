import React from "react";

import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import useAuth from "./providers/auth";
import useOrg from "./providers/org";

import PrivateRoute from "./components/PrivateRoute";

import DashboardLayout from "./layouts/DashboardLayout";
import MainLayout from "./layouts/MainLayout";
import SignUpView from "./views/auth/SignUpView";
import SignUpSuccessView from "./views/auth/SignUpSuccessView";
import SignInView from "./views/auth/SignInView";
import HomeView from "./views/home/HomeView";
import DashboardView from "./views/reports/DashboardView";
import RegisterView from "./views/auth/RegisterView";
import LoginView from "./views/auth/LoginView";
import AccountView from "./views/account/AccountView";
import NotFoundView from "./views/errors/NotFoundView";
import CreateOrgView from "./views/org/CreateOrgView";
import OrganizationView from "./views/org/OrganizationView";
import OrgListView from "./views/org/OrgListView";
import EmployeeFormView from "./views/employees/EmployeeFormView";
import EmployeeListView from "./views/employees/EmployeeListView";
import EmployeeProfileView from "./views/employees/EmployeeProfileView";
import AttendanceView from "./views/attendance";
import LeaveManagementView from "./views/leaves/LeaveManagementView";
// import LeavesView from "./views/leaves/LeavesView";
// import LeaveListView from "./views/leaves/LeaveListView";
import PayrollGenerateView from "./views/payroll/PayrollGenerateView";
import PayrollDetailsView from "./views/payroll/PayrollDetailsView";
import PayrollListView from "./views/payroll/PayrollListView";
import PayrunView from "./views/payroll/PayrunView";
import PayslipDetailsView from "./views/payroll/PayslipDetailsView";
import ReportView from "./views/reports/ReportView";
import EmployeeHeadcountReport from "./views/reports/ReportView/EmployeeHeadcount";
import EmployeeTurnoverReport from "./views/reports/ReportView/EmployeeTurnover";
import AgeProfile from "./views/reports/ReportView/AgeProfile";
import GenderProfile from "./views/reports/ReportView/GenderProfile";
import JobHistoryReport from "./views/reports/ReportView/JobHistory";
import PayrollHoursView from "./views/reports/PayrollHoursView";
import SettingsView from "./views/settings/SettingsView";
import UserListView from "./views/users/UserListView";
import AbsenteesReportView from "./views/reports/AbsenteesReportView";
import LeaveBalancesReportView from "./views/reports/LeaveBalancesReportView";

const RoutesComponent = () => {
  const { auth } = useAuth();
  const { org } = useOrg();
  const isAuth = auth.isAuth

  const homePath = "/app/dashboard";
  const loginPath = "/login";

  return (
    <Routes>
      <PrivateRoute
        path="app"
        isAuth={isAuth}
        redirectTo={loginPath}
        element={<DashboardLayout />}
      >
        <PrivateRoute
          exact
          path="/"
          isAuth={isAuth}
          redirectTo={loginPath}
          element={<Navigate to="/dashboard" replace />}
        />
        <PrivateRoute
          exact
          path="/dashboard"
          isAuth={isAuth}
          redirectTo={loginPath}
          element={<DashboardView />}
        />

        <PrivateRoute
          path="account"
          isAuth={isAuth}
          redirectTo={loginPath}
          element={<Outlet />}
        >
          <Route path="/" element={<AccountView />} />
        </PrivateRoute>

        <PrivateRoute
          path="attendance"
          isAuth={isAuth}
          redirectTo={loginPath}
          element={<Outlet />}
        >
          <Route path="/" element={<AttendanceView />} />
        </PrivateRoute>

        <PrivateRoute
          path="employees"
          isAuth={isAuth}
          redirectTo={loginPath}
          element={<Outlet />}
        >
          <Route exact path="/" element={<EmployeeListView />} />
          <Route path="new" element={<EmployeeFormView />} />
          <Route path="edit/:id" element={<EmployeeFormView />} />
          <Route path=":id" element={<EmployeeProfileView />} />
        </PrivateRoute>

        <PrivateRoute
          path="leaves"
          isAuth={isAuth}
          redirectTo={loginPath}
          element={<Outlet />}
        >
          <Route path="/" element={<LeaveManagementView />} />
          {/* <Route path="/old" element={<LeavesView />} /> */}
          {/* <Route path="/list" element={<LeaveListView />} /> */}
        </PrivateRoute>

        <PrivateRoute
          path="org"
          exact
          isAuth={isAuth}
          redirectTo={loginPath}
          element={<OrganizationView />}
        />

        <PrivateRoute
          path="orgs"
          isAuth={isAuth}
          redirectTo={loginPath}
          element={<Outlet />}
        >
          <Route exact path="/" element={<OrgListView />} />
          <Route path="/new" element={<CreateOrgView />} />
          <Route path="/edit" element={<CreateOrgView org={org} />} />
          <Route path="/:id" element={<OrganizationView />} />
        </PrivateRoute>

        <PrivateRoute
          path="payroll"
          isAuth={isAuth}
          redirectTo={loginPath}
          element={<Outlet />}
        >
          <Route path="/" element={<Navigate to="list" replace={true} />} />
          <Route path="list" element={<PayrollListView />} />

          <Route path="generate" element={<PayrollGenerateView />} />
          <Route path=":id" element={<PayrollDetailsView />} />

          <Route path="process" element={<PayrunView />} />
        </PrivateRoute>

        <PrivateRoute
          path="payslips"
          isAuth={isAuth}
          redirectTo={loginPath}
          element={<Outlet />}
        >
          <Route path=":id" element={<PayslipDetailsView />} />
        </PrivateRoute>

        <PrivateRoute
          path="reports"
          isAuth={isAuth}
          redirectTo={loginPath}
          element={<Outlet />}
        >
          <Route path="/" element={<ReportView />} />
          <Route path="/headcount" element={<EmployeeHeadcountReport />} />
          <Route path="/turnover" element={<EmployeeTurnoverReport />} />
          <Route path="/age-profile" element={<AgeProfile />} />
          <Route path="/gender-profile" element={<GenderProfile />} />
          <Route path="/job-history" element={<JobHistoryReport />} />
          <Route path="/payroll-hours-view" element={<PayrollHoursView />} />
          <Route path="/absentees-view" element={<AbsenteesReportView />} />
          <Route
            path="/leave-balances-view"
            element={<LeaveBalancesReportView />}
          />
          <Route path="/" element={<ReportView />} />
        </PrivateRoute>
        <PrivateRoute
          path="settings"
          isAuth={isAuth}
          redirectTo={loginPath}
          element={<Outlet />}
        >
          <Route path="/" element={<SettingsView />} />
        </PrivateRoute>
        <PrivateRoute
          path="users"
          isAuth={isAuth}
          redirectTo={loginPath}
          element={<Outlet />}
        >
          <Route path="/" element={<UserListView />} />
        </PrivateRoute>

        <Route path="*" element={<Navigate to="/404" />} />
      </PrivateRoute>

      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<Navigate to={homePath} replace />} />
        <Route path="home" element={<HomeView />} />

        <Route path="signup" element={<SignUpView />} />
        <Route path="signup/success" element={<SignUpSuccessView />} />
        <Route path="signin" element={<SignInView />} />

        <Route path="register" element={<RegisterView />} />
        <Route path="login" element={<LoginView />} replace />
        <Route path="*" element={<NotFoundView />} />
      </Route>
    </Routes>
  );
};

export default RoutesComponent;
