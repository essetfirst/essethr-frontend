import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Grid, Typography, Paper, Button, Chip, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ActionCard from "components/ActionCard";
import { analyticsApi, inboxApi } from "features/platform/api";
import usePermissions from "features/auth/hooks/usePermissions";
import { PERMISSIONS } from "constants/permissions";

const StyledAlert = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(1),
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(1),
}));

const StyledAlertWarning = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(1),
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(1),
  borderLeft: `4px solid ${theme.palette.warning.main}`,
}));

const StyledAlertInfo = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(1),
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(1),
  borderLeft: `4px solid ${theme.palette.info.main}`,
}));

export default function OperationsCenter() {
  const { permissions } = usePermissions();
  const [ops, setOps] = React.useState(null);
  const [inbox, setInbox] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const canApproveLeaves = permissions.includes(PERMISSIONS.LEAVES_APPROVE);
  const canApproveWorkflows = permissions.includes(PERMISSIONS.WORKFLOWS_APPROVE);
  const canOpenApprovals = permissions.some((p) =>
    [
      PERMISSIONS.LEAVES_APPROVE,
      PERMISSIONS.WORKFLOWS_APPROVE,
      PERMISSIONS.ATTENDANCE_APPROVE,
      PERMISSIONS.PAYROLL_APPROVE,
    ].includes(p),
  );

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const opsRes = await analyticsApi.operations();
      setOps(opsRes?.operations || null);
      if (canApproveLeaves || canApproveWorkflows || canOpenApprovals) {
        const inboxRes = await inboxApi.workQueue();
        setInbox(inboxRes || null);
      } else {
        setInbox(null);
      }
    } catch {
      setOps(null);
      setInbox(null);
    } finally {
      setLoading(false);
    }
  }, [canApproveLeaves, canApproveWorkflows, canOpenApprovals]);

  React.useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={2} mb={2}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (!ops) {
    return (
      <Box mb={3}>
        <Typography variant="body2" color="textSecondary" align="center">
          Operations data unavailable.{" "}
          <Button size="small" onClick={load}>Retry</Button>
        </Typography>
      </Box>
    );
  }

  const { alerts = [], widgets = [], summary = {} } = ops;

  return (
    <Box mb={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Control center
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            Operations
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          {canOpenApprovals && (
            <Button component={RouterLink} to="/app/inbox" variant="outlined" size="small" color="primary">
              Approvals {inbox?.counts?.total ? `(${inbox.counts.total})` : ""}
            </Button>
          )}
          <Button size="small" onClick={load}>Refresh</Button>
        </Box>
      </Box>

      {alerts.length > 0 && (
        <Box mb={2}>
          {alerts.map((alert) => {
            const AlertPaper =
              alert.severity === "warning" ? StyledAlertWarning : StyledAlertInfo;
            return (
            <AlertPaper key={alert.title} variant="outlined">
              {alert.severity === "warning" ? (
                <WarningIcon color="secondary" fontSize="small" />
              ) : (
                <CheckCircleIcon color="primary" fontSize="small" />
              )}
              <Box flex={1}>
                <Typography variant="subtitle2">{alert.title}</Typography>
                {alert.message && (
                  <Typography variant="body2" color="textSecondary">{alert.message}</Typography>
                )}
              </Box>
              {alert.href && (
                <Button component={RouterLink} to={alert.href} size="small" color="primary">
                  Action
                </Button>
              )}
            </AlertPaper>
            );
          })}
        </Box>
      )}

      <Grid container spacing={2}>
        {widgets.map((w) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={w.key}>
            <ActionCard
              title={w.title}
              value={w.value}
              href={w.href}
              items={w.items}
              severity={w.value > 0 && w.key.includes("pending") ? "warning" : undefined}
            />
          </Grid>
        ))}
      </Grid>

      {summary.activeEmployees != null && (
        <Box mt={2} display="flex" flexWrap="wrap" gridGap={8}>
          <Chip label={`${summary.checkedInToday || 0} checked in`} size="small" />
          <Chip label={`${summary.onLeaveToday || 0} on leave today`} size="small" />
          <Chip label={`${summary.leaveCoveragePct || 0}% leave coverage`} size="small" />
        </Box>
      )}
    </Box>
  );
}
