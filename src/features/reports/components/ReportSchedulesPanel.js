import React from "react";
import {
  Box, Button, Paper, TextField, Typography, List, ListItem, ListItemText, Chip, MenuItem,
} from "@mui/material";
import { useSnackbar } from "notistack";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { reportsApi } from "features/platform/api";
import usePermissions from "features/auth/hooks/usePermissions";
import { PERMISSIONS } from "constants/permissions";

export default function ReportSchedulesPanel() {
  const { can } = usePermissions();
  const { enqueueSnackbar } = useSnackbar();
  const [schedules, setSchedules] = React.useState([]);
  const [form, setForm] = React.useState({
    name: "",
    reportType: "attendance",
    cron: "0 8 * * 1",
    recipients: "",
    format: "pdf",
  });

  const allowed = can(PERMISSIONS.REPORTS_SCHEDULE);

  const load = React.useCallback(async () => {
    if (!allowed) return;
    try {
      const res = await reportsApi.schedules();
      setSchedules(res?.schedules || []);
    } catch {
      enqueueSnackbar("Failed to load report schedules.", { variant: "error" });
    }
  }, [allowed, enqueueSnackbar]);

  React.useEffect(() => {
    load();
  }, [load]);

  if (!allowed) return null;

  const handleCreate = async () => {
    const recipients = form.recipients.split(",").map((e) => e.trim()).filter(Boolean);
    const res = await reportsApi.createSchedule({ ...form, recipients });
    if (res?.success) {
      enqueueSnackbar("Schedule created.", { variant: "success" });
      setForm({ name: "", reportType: "attendance", cron: "0 8 * * 1", recipients: "", format: "pdf" });
      load();
    } else {
      enqueueSnackbar(res?.error || "Failed to create schedule.", { variant: "error" });
    }
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <ScheduleIcon color="primary" fontSize="small" />
        <Typography variant="h6">Scheduled delivery</Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Email delivery runs on a cron schedule (runner logs due jobs; wire SMTP export in production).
      </Typography>
      <Box display="grid" gap={1.5} mb={2}>
        <TextField label="Name" size="small" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <TextField select label="Report type" size="small" value={form.reportType} onChange={(e) => setForm((f) => ({ ...f, reportType: e.target.value }))}>
          {["attendance", "payroll", "leaves", "employees"].map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </TextField>
        <TextField label="Cron" size="small" value={form.cron} onChange={(e) => setForm((f) => ({ ...f, cron: e.target.value }))} helperText="e.g. 0 8 * * 1 = Mondays 08:00" />
        <TextField label="Recipients (comma-separated emails)" size="small" value={form.recipients} onChange={(e) => setForm((f) => ({ ...f, recipients: e.target.value }))} />
        <Button variant="contained" onClick={handleCreate} sx={{ alignSelf: "flex-start" }}>
          Add schedule
        </Button>
      </Box>
      <List dense>
        {schedules.map((s) => (
          <ListItem key={s._id} divider secondaryAction={
            <Chip size="small" label={s.active ? "Active" : "Paused"} color={s.active ? "success" : "default"} />
          }>
            <ListItemText
              primary={s.name}
              secondary={`${s.reportType} · ${s.cron} · ${(s.recipients || []).join(", ")}`}
            />
          </ListItem>
        ))}
        {!schedules.length && (
          <Typography variant="body2" color="text.secondary">No schedules yet.</Typography>
        )}
      </List>
    </Paper>
  );
}
