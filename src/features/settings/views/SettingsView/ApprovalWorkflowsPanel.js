import React from "react";
import {
  Box, Button, Paper, TextField, Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { workflowsApi } from "features/platform/api";

export default function ApprovalWorkflowsPanel() {
  const { enqueueSnackbar } = useSnackbar();
  const [templates, setTemplates] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [tplForm, setTplForm] = React.useState({ name: "", type: "general" });

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await workflowsApi.templates();
      setTemplates(res?.templates || []);
    } catch {
      enqueueSnackbar("Failed to load approval rules.", { variant: "error" });
    }
    setLoading(false);
  }, [enqueueSnackbar]);

  React.useEffect(() => { load(); }, [load]);

  const handleCreateTemplate = async () => {
    if (!tplForm.name.trim()) {
      enqueueSnackbar("Enter a rule name.", { variant: "warning" });
      return;
    }
    const res = await workflowsApi.createTemplate(tplForm);
    if (res?.success) {
      enqueueSnackbar("Approval rule saved.", { variant: "success" });
      setTplForm({ name: "", type: "general" });
      load();
    } else {
      enqueueSnackbar(res?.error || "Save failed.", { variant: "error" });
    }
  };

  return (
    <Box>
      <Typography variant="body2" color="textSecondary" paragraph>
        Optional advanced setup for custom multi-step approvals. Most teams only need
        {" "}<strong>Approvals</strong> in the sidebar (leave, attendance, payroll).
        Use this only when you need extra approval types beyond those modules.
      </Typography>

      <Paper style={{ padding: 16, marginBottom: 16 }}>
        <Typography variant="subtitle1" gutterBottom>New approval rule</Typography>
        <Box display="flex" flexWrap="wrap" style={{ gap: 12 }} alignItems="flex-end">
          <TextField
            label="Rule name"
            size="small"
            value={tplForm.name}
            onChange={(e) => setTplForm({ ...tplForm, name: e.target.value })}
          />
          <TextField
            label="Type code"
            size="small"
            helperText="e.g. expense, transfer"
            value={tplForm.type}
            onChange={(e) => setTplForm({ ...tplForm, type: e.target.value })}
          />
          <Button variant="contained" color="primary" onClick={handleCreateTemplate}>
            Save rule
          </Button>
        </Box>
      </Paper>

      {loading ? (
        <Typography color="textSecondary">Loading…</Typography>
      ) : templates.length === 0 ? (
        <Typography color="textSecondary">No custom approval rules configured.</Typography>
      ) : (
        templates.map((t) => (
          <Paper key={t._id} style={{ padding: 12, marginBottom: 8 }} variant="outlined">
            <Typography>{t.name}</Typography>
            <Typography variant="caption" color="textSecondary">Type: {t.type}</Typography>
          </Paper>
        ))
      )}
    </Box>
  );
}
