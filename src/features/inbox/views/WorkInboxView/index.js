import { fromNow } from "utils/date";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Paper, Button, Chip, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import InboxIcon from "@mui/icons-material/Inbox";
import PageView from "components/PageView";
import EmptyState from "components/EmptyState";
import { inboxApi, workflowsApi } from "features/platform/api";
import { useSnackbar } from "notistack";
import usePermissions from "features/auth/hooks/usePermissions";
import { PERMISSIONS } from "constants/permissions";

const APPROVAL_PERMS = [
  PERMISSIONS.LEAVES_APPROVE,
  PERMISSIONS.WORKFLOWS_APPROVE,
  PERMISSIONS.ATTENDANCE_APPROVE,
  PERMISSIONS.PAYROLL_APPROVE,
];

const StyledItem = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: theme.spacing(1),
}));

const KIND_LABELS = {
  leave_approval: "Leave",
  workflow_approval: "Other request",
  attendance_approval: "Attendance",
  payroll_finalize: "Payroll",
  onboarding_overdue: "Onboarding",
};

export default function WorkInboxView() {
  const { enqueueSnackbar } = useSnackbar();
  const { canAny } = usePermissions();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const canApprove = canAny(...APPROVAL_PERMS);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await inboxApi.workQueue();
      setData(res);
    } catch {
      enqueueSnackbar("Failed to load approvals.", { variant: "error" });
    }
    setLoading(false);
  }, [enqueueSnackbar]);

  React.useEffect(() => { load(); }, [load]);

  const handleApproveWorkflow = async (id) => {
    const res = await workflowsApi.approve(id, {});
    if (res?.success) {
      enqueueSnackbar("Approved.", { variant: "success" });
      load();
    } else {
      enqueueSnackbar(res?.error || "Approval failed.", { variant: "error" });
    }
  };

  if (!canApprove) {
    return (
      <PageView title="Approvals" icon={<InboxIcon fontSize="large" />} backPath="/app/dashboard">
        <Typography color="textSecondary">You do not have approval permissions.</Typography>
      </PageView>
    );
  }

  const items = data?.items || [];

  return (
    <PageView title="Approvals" icon={<InboxIcon fontSize="large" />} backPath="/app/dashboard">
      <Typography variant="body2" color="textSecondary" paragraph>
        Everything waiting for your sign-off — leave, attendance, payroll, and other requests — in one place.
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="body2" color="textSecondary">
          {data?.counts?.total || 0} item(s) need your attention
        </Typography>
        <Button size="small" onClick={load}>Refresh</Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<InboxIcon />}
          title="All caught up"
          description="No pending approvals right now."
          actionLabel="Go to Dashboard"
          onAction={() => window.location.assign("/app/dashboard")}
        />
      ) : (
        items.map((item) => (
          <StyledItem key={item.id} variant="outlined">
            <Box>
              <Box display="flex" alignItems="center" style={{ gap: 8 }} mb={0.5}>
                <Chip size="small" label={KIND_LABELS[item.kind] || item.kind} />
                <Chip
                  size="small"
                  color={item.priority === "high" ? "secondary" : "default"}
                  label={item.priority}
                  variant="outlined"
                />
              </Box>
              <Typography variant="subtitle1">{item.title}</Typography>
              <Typography variant="body2" color="textSecondary">{item.subtitle}</Typography>
              <Typography variant="caption" color="textSecondary">
                {fromNow(item.createdOn)}
              </Typography>
            </Box>
            <Box display="flex" style={{ gap: 8 }}>
              {item.actions?.map((action) => {
                if (action.action === "approve_workflow") {
                  return (
                    <Button
                      key={action.id}
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleApproveWorkflow(action.id)}
                    >
                      Approve
                    </Button>
                  );
                }
                if (action.href) {
                  return (
                    <Button
                      key={action.label}
                      component={RouterLink}
                      to={action.href}
                      variant="outlined"
                      size="small"
                      color="primary"
                    >
                      {action.label}
                    </Button>
                  );
                }
                return null;
              })}
              {item.href && !item.actions?.length && (
                <Button component={RouterLink} to={item.href} variant="contained" color="primary" size="small">
                  Review
                </Button>
              )}
            </Box>
          </StyledItem>
        ))
      )}
    </PageView>
  );
}
