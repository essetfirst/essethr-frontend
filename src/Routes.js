import React from "react";
import { Box, CircularProgress } from "@mui/material";

import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import useAuth from "features/auth/providers";
import useOrg from "features/org/providers";

import DashboardLayout from "./layouts/DashboardLayout";
import MainLayout from "./layouts/MainLayout";
import SignUpSuccessView from "features/auth/views/SignUpSuccessView";
import HomeView from "features/home/views/HomeView";
import DashboardView from "features/reports/views/DashboardView";
import RegisterView from "features/auth/views/RegisterView";
import SignUpView from "features/auth/views/SignUpView";
import LoginView from "features/auth/views/LoginView";
import AccountView from "features/account/views/AccountView";
import NotFoundView from "features/errors/views/NotFoundView";
import CreateOrgView from "features/org/views/CreateOrgView";
import OrganizationView from "features/org/views/OrganizationView";
import OrgListView from "features/org/views/OrgListView";
import EmployeeFormView from "features/employees/views/EmployeeFormView";
import EmployeeListView from "features/employees/views/EmployeeListView";
import EmployeeProfileView from "features/employees/views/EmployeeProfileView";
import AttendanceView from "features/attendance/views";
import LeaveManagementView from "features/leaves/views/LeaveManagementView";
import PayrollGenerateView from "features/payroll/views/PayrollGenerateView";
import PayrollDetailsView from "features/payroll/views/PayrollDetailsView";
import PayrollListView from "features/payroll/views/PayrollListView";
import PayrunView from "features/payroll/views/PayrunView";
import PayslipDetailsView from "features/payroll/views/PayslipDetailsView";
import ReportView from "features/reports/views/ReportView";
import EmployeeHeadcountReport from "features/reports/views/ReportView/EmployeeHeadcount";
import EmployeeTurnoverReport from "features/reports/views/ReportView/EmployeeTurnover";
import AgeProfile from "features/reports/views/ReportView/AgeProfile";
import GenderProfile from "features/reports/views/ReportView/GenderProfile";
import JobHistoryReport from "features/reports/views/ReportView/JobHistory";
import PayrollHoursView from "features/reports/views/PayrollHoursView";
import SettingsView from "features/settings/views/SettingsView";
import UserListView from "features/users/views/UserListView";
import AbsenteesReportView from "features/reports/views/AbsenteesReportView";
import LeaveBalancesReportView from "features/reports/views/LeaveBalancesReportView";
import EmployeePortal from "features/ess/views/EmployeePortal";
import ShiftScheduleView from "features/shifts/views/ShiftScheduleView";
import RecruitmentView from "features/recruitment/views/RecruitmentView";
import OnboardingView from "features/onboarding/views/OnboardingView";
import OffboardingView from "features/offboarding/views/OffboardingView";
import ManagerDashboardView from "features/manager/views/ManagerDashboardView";
import PerformanceView from "features/performance/views/PerformanceView";
import TrainingView from "features/training/views/TrainingView";
import BenefitsView from "features/benefits/views/BenefitsView";
import ExpensesView from "features/expenses/views/ExpensesView";
import AnnouncementsView from "features/announcements/views/AnnouncementsView";
import WorkInboxView from "features/inbox/views/WorkInboxView";
import RootIndexRedirect from "./components/RootIndexRedirect";
import RequirePermission from "./components/RequirePermission";
import { PERMISSIONS } from "constants/permissions";

/** RR v6+: layout route — requires auth or redirects to login */
function RequireAuth() {
  const { auth, bootstrapping } = useAuth();

  if (bootstrapping) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!auth?.isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

const RoutesComponent = () => {
  const { org } = useOrg();

  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardView />} />
          <Route
            path="manager"
            element={
              <RequirePermission
                anyOf={[
                  PERMISSIONS.LEAVES_APPROVE,
                  PERMISSIONS.WORKFLOWS_APPROVE,
                  PERMISSIONS.ATTENDANCE_APPROVE,
                ]}
              >
                <ManagerDashboardView />
              </RequirePermission>
            }
          />

          <Route
            path="inbox"
            element={
              <RequirePermission
                anyOf={[
                  PERMISSIONS.LEAVES_APPROVE,
                  PERMISSIONS.WORKFLOWS_APPROVE,
                  PERMISSIONS.ATTENDANCE_APPROVE,
                  PERMISSIONS.PAYROLL_APPROVE,
                ]}
              >
                <WorkInboxView />
              </RequirePermission>
            }
          />

          <Route path="account" element={<Outlet />}>
            <Route index element={<AccountView />} />
          </Route>

          <Route path="attendance" element={<Outlet />}>
            <Route index element={<AttendanceView />} />
          </Route>

          <Route path="employees" element={<Outlet />}>
            <Route index element={<EmployeeListView />} />
            <Route path="new" element={<EmployeeFormView />} />
            <Route path="edit/:id" element={<EmployeeFormView />} />
            <Route path=":id" element={<EmployeeProfileView />} />
          </Route>

          <Route path="leaves" element={<Outlet />}>
            <Route index element={<LeaveManagementView />} />
          </Route>

          <Route
            path="org"
            element={
              <RequirePermission permission={PERMISSIONS.ORG_READ}>
                <OrganizationView />
              </RequirePermission>
            }
          />

          <Route path="orgs" element={<Outlet />}>
            <Route index element={<OrgListView />} />
            <Route path="new" element={<CreateOrgView />} />
            <Route path="edit" element={<CreateOrgView org={org} />} />
            <Route path=":id" element={<OrganizationView />} />
          </Route>

          <Route path="payroll" element={<Outlet />}>
            <Route index element={<Navigate to="list" replace />} />
            <Route path="list" element={<PayrollListView />} />
            <Route path="generate" element={<PayrollGenerateView />} />
            {/* Static segments before :id so "process" is not captured as an id */}
            <Route path="process" element={<PayrunView />} />
            <Route path=":id" element={<PayrollDetailsView />} />
          </Route>

          <Route path="payslips" element={<Outlet />}>
            <Route path=":id" element={<PayslipDetailsView />} />
          </Route>

          <Route path="reports" element={<Outlet />}>
            <Route index element={<ReportView />} />
            <Route path="headcount" element={<EmployeeHeadcountReport />} />
            <Route path="turnover" element={<EmployeeTurnoverReport />} />
            <Route path="age-profile" element={<AgeProfile />} />
            <Route path="gender-profile" element={<GenderProfile />} />
            <Route path="job-history" element={<JobHistoryReport />} />
            <Route path="payroll-hours-view" element={<PayrollHoursView />} />
            <Route path="absentees-view" element={<AbsenteesReportView />} />
            <Route
              path="leave-balances-view"
              element={<LeaveBalancesReportView />}
            />
          </Route>

          <Route path="settings" element={<Outlet />}>
            <Route
              index
              element={
                <RequirePermission permission={PERMISSIONS.SETTINGS_READ}>
                  <SettingsView />
                </RequirePermission>
              }
            />
          </Route>

          <Route path="users" element={<Outlet />}>
            <Route
              index
              element={
                <RequirePermission permission={PERMISSIONS.USERS_READ}>
                  <UserListView />
                </RequirePermission>
              }
            />
          </Route>

          <Route
            path="portal"
            element={
              <RequirePermission permission={PERMISSIONS.ESS_ACCESS}>
                <EmployeePortal />
              </RequirePermission>
            }
          />
          <Route path="shifts" element={<RequirePermission permission={PERMISSIONS.SHIFTS_READ}><ShiftScheduleView /></RequirePermission>} />
          <Route
            path="workflows"
            element={<Navigate to="/app/settings?tab=approval-rules" replace />}
          />
          <Route path="recruitment" element={<RequirePermission permission={PERMISSIONS.RECRUITMENT_READ}><RecruitmentView /></RequirePermission>} />
          <Route path="onboarding" element={<RequirePermission permission={PERMISSIONS.ONBOARDING_READ}><OnboardingView /></RequirePermission>} />
          <Route path="offboarding" element={<RequirePermission permission={PERMISSIONS.OFFBOARDING_READ}><OffboardingView /></RequirePermission>} />
          <Route path="performance" element={<RequirePermission permission={PERMISSIONS.PERFORMANCE_READ}><PerformanceView /></RequirePermission>} />
          <Route path="training" element={<RequirePermission permission={PERMISSIONS.TRAINING_READ}><TrainingView /></RequirePermission>} />
          <Route path="benefits" element={<RequirePermission permission={PERMISSIONS.BENEFITS_READ}><BenefitsView /></RequirePermission>} />
          <Route path="expenses" element={<RequirePermission permission={PERMISSIONS.EXPENSES_READ}><ExpensesView /></RequirePermission>} />
          <Route path="analytics" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="announcements" element={<RequirePermission permission={PERMISSIONS.ANNOUNCEMENTS_WRITE}><AnnouncementsView /></RequirePermission>} />

          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Route>

      <Route path="/404" element={<MainLayout />}>
        <Route index element={<NotFoundView />} />
      </Route>

      <Route path="/" element={<MainLayout />}>
        <Route index element={<RootIndexRedirect />} />
        <Route path="home" element={<HomeView />} />
        <Route path="signup" element={<SignUpView />} />
        <Route path="signup/success" element={<SignUpSuccessView />} />
        <Route path="signin" element={<Navigate to="/login" replace />} />
        <Route path="register" element={<RegisterView />} />
        <Route path="login" element={<LoginView />} />
        <Route path="*" element={<NotFoundView />} />
      </Route>
    </Routes>
  );
};

export default RoutesComponent;
