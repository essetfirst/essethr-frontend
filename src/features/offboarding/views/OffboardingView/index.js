import { fmt } from "utils/date";
import React from "react";
import {
  Box, Button, Paper, TextField, Typography, LinearProgress, List, ListItem, ListItemText, Chip, MenuItem,
} from "@mui/material";
import { useSnackbar } from "notistack";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PageView from "components/PageView";
import TabbedComponent from "components/TabbedComponent";
import PageSkeleton from "components/PageSkeleton";
import EmptyState from "components/EmptyState";
import { offboardingApi } from "features/platform/api";

function parseTasksInput(raw) {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      const [title, dueDaysStr] = trimmed.split(":").map((s) => s.trim());
      const dueDays = dueDaysStr != null && dueDaysStr !== "" ? Number(dueDaysStr) : 7;
      return { title, dueDays: Number.isNaN(dueDays) ? 7 : dueDays };
    })
    .filter((t) => t.title);
}

export default function OffboardingView() {
  const { enqueueSnackbar } = useSnackbar();
  const [templates, setTemplates] = React.useState([]);
  const [instances, setInstances] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [tplForm, setTplForm] = React.useState({ name: "", tasks: "" });
  const [startForm, setStartForm] = React.useState({
    employeeId: "",
    templateId: "",
    lastWorkingDay: "",
    exitReason: "",
  });

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [tRes, iRes] = await Promise.all([
        offboardingApi.templates(),
        offboardingApi.instances({}),
      ]);
      setTemplates(tRes?.templates || []);
      setInstances(iRes?.instances || []);
    } catch {
      enqueueSnackbar("Failed to load offboarding.", { variant: "error" });
    }
    setLoading(false);
  }, [enqueueSnackbar]);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleCreateTemplate = async () => {
    const tasks = parseTasksInput(tplForm.tasks);
    const res = await offboardingApi.createTemplate({ name: tplForm.name, tasks });
    if (res?.success) {
      enqueueSnackbar("Template saved.", { variant: "success" });
      setTplForm({ name: "", tasks: "" });
      load();
    }
  };

  const handleStart = async () => {
    const res = await offboardingApi.start(startForm);
    if (res?.success) {
      enqueueSnackbar("Offboarding started.", { variant: "success" });
      setStartForm({ employeeId: "", templateId: "", lastWorkingDay: "", exitReason: "" });
      load();
    } else {
      enqueueSnackbar(res?.error || "Failed to start.", { variant: "error" });
    }
  };

  const completeTask = async (instanceId, taskId) => {
    const res = await offboardingApi.completeTask(instanceId, taskId);
    if (res?.success) load();
  };

  const tabs = [
    {
      label: "Templates",
      panel: (
        <Box>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              New exit checklist template
            </Typography>
            <TextField
              fullWidth
              label="Template name"
              margin="dense"
              value={tplForm.name}
              onChange={(e) => setTplForm((f) => ({ ...f, name: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Tasks (Title:days, comma-separated)"
              margin="dense"
              value={tplForm.tasks}
              onChange={(e) => setTplForm((f) => ({ ...f, tasks: e.target.value }))}
              helperText="e.g. Return laptop:3, Exit interview:7"
            />
            <Button variant="contained" sx={{ mt: 1 }} onClick={handleCreateTemplate}>
              Save template
            </Button>
          </Paper>
          <List>
            {templates.map((t) => (
              <ListItem key={t._id} divider>
                <ListItemText primary={t.name} secondary={`${t.tasks?.length || 0} tasks`} />
              </ListItem>
            ))}
            {!templates.length && <EmptyState message="No offboarding templates yet." />}
          </List>
        </Box>
      ),
    },
    {
      label: "Active cases",
      panel: (
        <Box>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Start offboarding
            </Typography>
            <TextField
              fullWidth
              label="Employee ID"
              margin="dense"
              value={startForm.employeeId}
              onChange={(e) => setStartForm((f) => ({ ...f, employeeId: e.target.value }))}
            />
            <TextField
              select
              fullWidth
              label="Template (optional)"
              margin="dense"
              value={startForm.templateId}
              onChange={(e) => setStartForm((f) => ({ ...f, templateId: e.target.value }))}
            >
              <MenuItem value="">None</MenuItem>
              {templates.map((t) => (
                <MenuItem key={t._id} value={t._id}>
                  {t.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Last working day"
              type="date"
              margin="dense"
              InputLabelProps={{ shrink: true }}
              value={startForm.lastWorkingDay}
              onChange={(e) => setStartForm((f) => ({ ...f, lastWorkingDay: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Exit reason"
              margin="dense"
              value={startForm.exitReason}
              onChange={(e) => setStartForm((f) => ({ ...f, exitReason: e.target.value }))}
            />
            <Button variant="contained" sx={{ mt: 1 }} onClick={handleStart}>
              Start offboarding
            </Button>
          </Paper>
          {instances.map((inst) => (
            <Paper key={inst._id} sx={{ p: 2, mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1">
                  Employee {inst.employeeId}
                </Typography>
                <Chip size="small" label={inst.status} color={inst.status === "completed" ? "success" : "primary"} />
              </Box>
              {inst.lastWorkingDay && (
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  Last day: {fmt(inst.lastWorkingDay, "yyyy-MM-dd")}
                </Typography>
              )}
              <LinearProgress variant="determinate" value={inst.progress || 0} sx={{ mb: 1 }} />
              <List dense>
                {(inst.tasks || []).map((task) => (
                  <ListItem key={task.id}>
                    <ListItemText
                      primary={task.title}
                      secondary={task.completed ? "Done" : task.dueDate ? `Due ${fmt(task.dueDate, "yyyy-MM-dd")}` : ""}
                    />
                    {!task.completed && (
                      <Button size="small" onClick={() => completeTask(inst._id, task.id)}>
                        Complete
                      </Button>
                    )}
                  </ListItem>
                ))}
              </List>
            </Paper>
          ))}
          {!instances.length && <EmptyState message="No active offboarding cases." />}
        </Box>
      ),
    },
  ];

  return (
    <PageView title="Offboarding" icon={<ExitToAppIcon />}>
      {loading ? <PageSkeleton /> : <TabbedComponent tabs={tabs} />}
    </PageView>
  );
}
