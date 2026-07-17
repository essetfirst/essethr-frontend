import { fmt } from "utils/date";
import React from "react";
import {
  Box, Button, Paper, TextField, Typography, LinearProgress, List, ListItem, ListItemText, Chip, MenuItem,
} from "@mui/material";
import { useSnackbar } from "notistack";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PageView from "components/PageView";
import TabbedComponent from "components/TabbedComponent";
import PageSkeleton from "components/PageSkeleton";
import EmptyState from "components/EmptyState";
import { onboardingApi } from "features/platform/api";

function parseTasksInput(raw) {
  if (!raw?.trim()) return [];
  return raw.split(",").map((part) => {
    const trimmed = part.trim();
    const [title, dueDaysStr] = trimmed.split(":").map((s) => s.trim());
    const dueDays = dueDaysStr != null && dueDaysStr !== "" ? Number(dueDaysStr) : 7;
    return { title, dueDays: Number.isNaN(dueDays) ? 7 : dueDays };
  }).filter((t) => t.title);
}

export default function OnboardingView() {
  const { enqueueSnackbar } = useSnackbar();
  const [templates, setTemplates] = React.useState([]);
  const [instances, setInstances] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [tplForm, setTplForm] = React.useState({ name: "", tasks: "" });
  const [startForm, setStartForm] = React.useState({ employeeId: "", templateId: "" });

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [tRes, iRes] = await Promise.all([
        onboardingApi.templates(),
        onboardingApi.instances({}),
      ]);
      setTemplates(tRes?.templates || []);
      setInstances(iRes?.instances || []);
    } catch (e) {
      enqueueSnackbar("Failed to load onboarding.", { variant: "error" });
    }
    setLoading(false);
  }, [enqueueSnackbar]);

  React.useEffect(() => { load(); }, [load]);

  const handleCreateTemplate = async () => {
    const tasks = parseTasksInput(tplForm.tasks);
    const res = await onboardingApi.createTemplate({ name: tplForm.name, tasks });
    if (res?.success) {
      enqueueSnackbar("Template saved.", { variant: "success" });
      setTplForm({ name: "", tasks: "" });
      load();
    }
  };

  const handleStart = async () => {
    const res = await onboardingApi.start(startForm);
    if (res?.success) {
      enqueueSnackbar("Onboarding started.", { variant: "success" });
      setStartForm({ employeeId: "", templateId: "" });
      load();
    } else {
      enqueueSnackbar(res?.error || "Failed to start.", { variant: "error" });
    }
  };

  const completeTask = async (instanceId, taskId) => {
    const res = await onboardingApi.completeTask(instanceId, taskId);
    if (res?.success) load();
  };

  const tabs = [
    {
      label: "Templates",
      panel: (
        <Box>
          <Paper style={{ padding: 16, marginBottom: 16 }}>
            <Typography variant="subtitle2" gutterBottom>
              New template — tasks as &ldquo;Title:dueDays&rdquo; (e.g. IT setup:3, Contract:1)
            </Typography>
            <Box display="flex" flexWrap="wrap" gridGap={12} alignItems="flex-end">
              <TextField label="Name" size="small" value={tplForm.name}
                onChange={(e) => setTplForm({ ...tplForm, name: e.target.value })} />
              <TextField label="Tasks" size="small" value={tplForm.tasks}
                placeholder="Contract:1, IT setup:3, Training:7"
                onChange={(e) => setTplForm({ ...tplForm, tasks: e.target.value })} style={{ minWidth: 320 }} />
              <Button variant="contained" color="primary" onClick={handleCreateTemplate}>Save</Button>
            </Box>
          </Paper>
          {templates.length === 0 ? (
            <EmptyState title="No templates" description="Create a checklist template with due-day offsets." />
          ) : (
            templates.map((t) => (
              <Paper key={t._id} style={{ padding: 12, marginBottom: 8 }} variant="outlined">
                <Typography variant="subtitle1">{t.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {(t.tasks || []).map((task) => `${task.title} (${task.dueDays || "?"}d)`).join(" · ")}
                </Typography>
              </Paper>
            ))
          )}
        </Box>
      ),
    },
    {
      label: "Instances",
      panel: (
        <Box>
          <Paper style={{ padding: 16, marginBottom: 16 }}>
            <Box display="flex" flexWrap="wrap" gridGap={12} alignItems="flex-end">
              <TextField label="Employee ID" size="small" value={startForm.employeeId}
                onChange={(e) => setStartForm({ ...startForm, employeeId: e.target.value })} />
              <TextField select label="Template" size="small" value={startForm.templateId}
                onChange={(e) => setStartForm({ ...startForm, templateId: e.target.value })} style={{ minWidth: 200 }}>
                {templates.map((t) => (
                  <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>
                ))}
              </TextField>
              <Button variant="contained" color="primary" onClick={handleStart}>Start onboarding</Button>
            </Box>
          </Paper>
          {instances.length === 0 ? (
            <EmptyState title="No active onboarding" description="Start onboarding for a new hire." />
          ) : (
            instances.map((inst) => {
              const tasks = inst.tasks || [];
              const done = tasks.filter((t) => t.completed).length;
              const pct = tasks.length ? Math.round((done / tasks.length) * 100) : inst.progress || 0;
              const overdue = tasks.filter(
                (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date(),
              ).length;
              return (
                <Paper key={inst._id} style={{ padding: 16, marginBottom: 12 }} variant="outlined">
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">
                      Employee {inst.employeeId}
                    </Typography>
                    <Box display="flex" gridGap={8}>
                      {overdue > 0 && <Chip size="small" color="secondary" label={`${overdue} overdue`} />}
                      <Chip size="small" label={inst.status || "in_progress"} />
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gridGap={12} my={1}>
                    <LinearProgress variant="determinate" value={pct} style={{ flex: 1, height: 8, borderRadius: 4 }} />
                    <Typography variant="body2">{pct}%</Typography>
                  </Box>
                  <List dense>
                    {tasks.map((task) => {
                      const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date();
                      return (
                        <ListItem key={task.id ?? task.title} divider>
                          <ListItemText
                            primary={task.title}
                            secondary={
                              task.completed
                                ? `Completed ${fmt(task.completedOn, "MMM d")}`
                                : task.dueDate
                                ? `Due ${fmt(task.dueDate, "MMM d, yyyy")}${isOverdue ? " · OVERDUE" : ""}`
                                : "Pending"
                            }
                            primaryTypographyProps={isOverdue ? { color: "error" } : undefined}
                          />
                          {!task.completed && task.id != null && (
                            <Button size="small" color="primary" onClick={() => completeTask(inst._id, task.id)}>
                              Complete
                            </Button>
                          )}
                        </ListItem>
                      );
                    })}
                  </List>
                </Paper>
              );
            })
          )}
        </Box>
      ),
    },
  ];

  return (
    <PageView title="Employee Onboarding" icon={<AssignmentTurnedInIcon fontSize="large" />} backPath="/app/dashboard" breadcrumbs>
      {loading ? <PageSkeleton showTitle={false} showActions={false} contentRows={4} /> : (
        <TabbedComponent tabs={tabs} />
      )}
    </PageView>
  );
}
