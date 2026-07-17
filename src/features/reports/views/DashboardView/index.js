import { fmtNow } from "utils/date";
import React from "react";
import { Grid } from "@mui/material";
import {
  DashboardOutlined as DashboardIcon,
  PeopleOutlined as PeopleIcon,
  AccessTime as AttendanceIcon,
  TimeToLeaveOutlined as LeaveIcon,
  PersonOffOutlined as InactiveIcon,
} from "@mui/icons-material";

import useAuth from "features/auth/providers";
import useOrg from "features/org/providers";
import useBranches from "features/org/hooks/useBranches";
import usePermissions from "features/auth/hooks/usePermissions";
import { PERMISSIONS } from "constants/permissions";
import PageView from "components/PageView";
import MetricCard from "components/MetricCard";
import useLeave from "features/leaves/providers";

import Backdrop from "@mui/material/Backdrop";
import AttendanceSummary from "features/attendance/views/AttendanceSummary";
import useAttendance from "features/attendance/providers";
import { ThreeDots } from "react-loading-icons";
import OperationsCenter from "./OperationsCenter";
import WorkforceAnalyticsPanel from "features/analytics/components/WorkforceAnalyticsPanel";
import { styled } from "@mui/material/styles";

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  color: "#fff",
  backdropFilter: "blur(4px)",
}));

const DashboardView = () => {
  const { auth } = useAuth();
  const { can } = usePermissions();
  const showAnalytics = can(PERMISSIONS.ANALYTICS_READ);
  const { org, requesting, error, currentOrg } = useOrg();
  const { branchLabel, activeBranch } = useBranches();
  const employees = Array.isArray(org?.employees) ? org.employees : [];

  const waitingForOrg =
    !!(auth?.token && auth?.user?.org) && !error && !org?._id;
  const showLoadingOverlay = requesting || waitingForOrg;
  const { state, fetchAttendance } = useAttendance();
  const { state: leavesState, fetchLeaves } = useLeave();

  const today = fmtNow("yyyy-MM-dd");
  const activeCount = employees.filter((e) => e.status === "active").length;
  const inactiveCount = employees.filter((e) => e.status === "inactive").length;
  const totalCount = employees.length;
  const todayAttendance = state.attendanceByDate[today]?.length || 0;
  const leaveCount = leavesState.fetchLeaves.leaves.length || 0;

  React.useEffect(() => {
    fetchAttendance();
    fetchLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrg, org?._id]);

  return (
    <PageView
      title={
        activeBranch?.branch
          ? `Dashboard · ${branchLabel(activeBranch._id)}`
          : "Dashboard"
      }
      icon={<DashboardIcon />}
    >
      {showLoadingOverlay && (
        <StyledBackdrop open>
          <ThreeDots width={80} height={80} fill="#fff" />
        </StyledBackdrop>
      )}

      <OperationsCenter />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <MetricCard
            label="Active employees"
            value={activeCount}
            trend={totalCount ? ((activeCount / totalCount) * 100).toFixed(0) : 0}
            trendLabel="of workforce active"
            icon={PeopleIcon}
            accentColor="#2563eb"
          />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <MetricCard
            label="Present today"
            value={todayAttendance}
            trend={totalCount ? ((todayAttendance / totalCount) * 100).toFixed(0) : 0}
            trendLabel="attendance rate"
            icon={AttendanceIcon}
            accentColor="#14b8a6"
          />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <MetricCard
            label="On leave"
            value={leaveCount}
            trend={totalCount ? ((leaveCount / totalCount) * 100).toFixed(0) : 0}
            trendLabel="currently away"
            icon={LeaveIcon}
            accentColor="#f59e0b"
          />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <MetricCard
            label="Inactive"
            value={inactiveCount}
            trend={totalCount ? ((inactiveCount / totalCount) * 100).toFixed(0) : 0}
            trendLabel="not active"
            icon={InactiveIcon}
            accentColor="#64748b"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <AttendanceSummary
            attendanceByDate={state.attendanceByDate}
            totalEmployees={totalCount}
          />
        </Grid>
        {showAnalytics && (
          <Grid item xs={12}>
            <WorkforceAnalyticsPanel />
          </Grid>
        )}
      </Grid>
    </PageView>
  );
};

export default DashboardView;
