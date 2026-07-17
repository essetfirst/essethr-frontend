import React from "react";
import {
  Box, Button, Paper, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody,
} from "@mui/material";
import { useSnackbar } from "notistack";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PageView from "components/PageView";
import TabbedComponent from "components/TabbedComponent";
import PageSkeleton from "components/PageSkeleton";
import { workflowsApi } from "features/platform/api";
import useOrg from "features/org/providers";
import { employeeNameFromMap } from "utils/employeeDisplay";
import arrayToMap from "utils/arrayToMap";

export default function WorkflowsView() {
  const { enqueueSnackbar } = useSnackbar();
  const { org } = useOrg();
  const employeesMap = React.useMemo(
    () => arrayToMap(org?.employees || [], "_id"),
    [org?.employees],
  );
  const [templates, setTemplates] = React.useState([]);
  const [requests, setRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [tplForm, setTplForm] = React.useState({ name: "", type: "leave" });

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [tRes, rRes] = await Promise.all([
        workflowsApi.templates(),
        workflowsApi.requests({ status: "pending" }),
      ]);
      setTemplates(tRes?.templates || []);
      setRequests(rRes?.requests || []);
    } catch (e) {
      enqueueSnackbar("Failed to load workflows.", { variant: "error" });
    }
    setLoading(false);
  }, [enqueueSnackbar]);

  React.useEffect(() => { load(); }, [load]);

  const handleCreateTemplate = async () => {
    const res = await workflowsApi.createTemplate(tplForm);
    if (res?.success) {
      enqueueSnackbar("Template saved.", { variant: "success" });
      setTplForm({ name: "", type: "leave" });
      load();
    } else {
      enqueueSnackbar(res?.error || "Failed.", { variant: "error" });
    }
  };

  const handleApprove = async (id) => {
    const res = await workflowsApi.approve(id, {});
    if (res?.success) {
      enqueueSnackbar("Approved.", { variant: "success" });
      load();
    }
  };

  const handleReject = async (id) => {
    const res = await workflowsApi.reject(id, {});
    if (res?.success) {
      enqueueSnackbar("Rejected.", { variant: "info" });
      load();
    }
  };

  const tabs = [
    {
      label: "Templates",
      panel: (
        <Box>
          <Paper style={{ padding: 16, marginBottom: 16 }}>
            <Typography variant="subtitle1" gutterBottom>New template</Typography>
            <Box display="flex" flexWrap="wrap" gridGap={12} alignItems="flex-end">
              <TextField label="Name" size="small" value={tplForm.name}
                onChange={(e) => setTplForm({ ...tplForm, name: e.target.value })} />
              <TextField label="Type" size="small" value={tplForm.type}
                onChange={(e) => setTplForm({ ...tplForm, type: e.target.value })} />
              <Button variant="contained" color="primary" onClick={handleCreateTemplate}>Save</Button>
            </Box>
          </Paper>
          {templates.map((t) => (
            <Paper key={t._id} style={{ padding: 12, marginBottom: 8 }} variant="outlined">
              <Typography>{t.name}</Typography>
              <Typography variant="caption" color="textSecondary">{t.type}</Typography>
            </Paper>
          ))}
          {!templates.length && <Typography color="textSecondary">No templates yet.</Typography>}
        </Box>
      ),
    },
    {
      label: "Inbox",
      panel: (
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Requester</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No pending approvals.</TableCell>
                </TableRow>
              ) : (
                requests.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell>{r.type}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell>{employeeNameFromMap(employeesMap, r.requesterId) || r.requesterId || "—"}</TableCell>
                    <TableCell>{r.createdOn ? new Date(r.createdOn).toLocaleDateString() : "—"}</TableCell>
                    <TableCell align="right">
                      {r.status === "pending" && (
                        <>
                          <Button size="small" color="primary" onClick={() => handleApprove(r._id)}>Approve</Button>
                          <Button size="small" onClick={() => handleReject(r._id)}>Reject</Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      ),
    },
  ];

  return (
    <PageView title="Workflows & Approvals" icon={<AccountTreeIcon fontSize="large" />} backPath="/app/dashboard" breadcrumbs>
      {loading ? <PageSkeleton showTitle={false} showActions={false} contentRows={4} /> : (
        <TabbedComponent tabs={tabs} />
      )}
    </PageView>
  );
}
