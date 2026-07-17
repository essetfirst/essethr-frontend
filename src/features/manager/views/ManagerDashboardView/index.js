import React from "react";
import { Grid, Box, Typography, Button, CircularProgress } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PageView from "components/PageView";
import OperationsCenter from "features/reports/views/DashboardView/OperationsCenter";
import ActionCard from "components/ActionCard";
import { useIntl } from "react-intl";
import usePermissions from "features/auth/hooks/usePermissions";
import { PERMISSIONS } from "constants/permissions";
import { inboxApi, analyticsApi } from "features/platform/api";
import { useEmployeesQuery } from "hooks/queries/useEmployeesQuery";

export default function ManagerDashboardView() {
  const intl = useIntl();
  const { permissions } = usePermissions();
  const { data: employeeData, isLoading: employeesLoading } = useEmployeesQuery();
  const [inbox, setInbox] = React.useState(null);
  const [teamStats, setTeamStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const canApprove =
    permissions.includes(PERMISSIONS.LEAVES_APPROVE) ||
    permissions.includes(PERMISSIONS.WORKFLOWS_APPROVE);

  React.useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const [inboxRes, opsRes] = await Promise.all([
          canApprove ? inboxApi.workQueue() : Promise.resolve(null),
          analyticsApi.operations().catch(() => null),
        ]);
        if (!active) return;
        setInbox(inboxRes);
        setTeamStats(opsRes?.operations?.summary ?? null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [canApprove]);

  const employees = employeeData?.employees ?? [];
  const activeCount = employees.filter((e) => e.status === "active").length;

  return (
    <PageView
      title={intl.formatMessage({ id: "manager.title", defaultMessage: "Manager dashboard" })}
      icon={<SupervisorAccountIcon />}
    >
      <Typography variant="body2" color="text.secondary" mb={3}>
        {intl.formatMessage({
          id: "manager.subtitle",
          defaultMessage: "Team operations, pending approvals, and workforce snapshot.",
        })}
      </Typography>

      {loading || employeesLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2.5} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <ActionCard title="Team size" value={activeCount} subtitle="Active employees in branch" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ActionCard
                title="Pending approvals"
                value={inbox?.counts?.total ?? 0}
                href="/app/inbox"
                actionLabel="Open inbox"
                severity={(inbox?.counts?.total ?? 0) > 0 ? "warning" : undefined}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ActionCard
                title="Checked in today"
                value={teamStats?.checkedInToday ?? "—"}
                subtitle="Across organization"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ActionCard
                title="On leave today"
                value={teamStats?.onLeaveToday ?? "—"}
                subtitle="Team availability"
              />
            </Grid>
          </Grid>

          <OperationsCenter />

          <Box mt={2} display="flex" gap={1} flexWrap="wrap">
            <Button component={RouterLink} to="/app/employees" variant="outlined" size="small">
              View team
            </Button>
            <Button component={RouterLink} to="/app/leaves" variant="outlined" size="small">
              Leave requests
            </Button>
            <Button component={RouterLink} to="/app/attendance" variant="outlined" size="small">
              Attendance
            </Button>
          </Box>
        </>
      )}
    </PageView>
  );
}
