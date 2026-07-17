import React from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useSnackbar } from "notistack";
import useOrg from "features/org/providers";
import API from "api";
import PermissionGate from "components/PermissionGate";
import { PERMISSIONS } from "constants/permissions";

const defaultForm = {
  payroll: { currency: "USD", payDay: 25, taxRate: 0, overtimeMultiplier: 1.5, lockAfterDays: 7 },
  leave: { requireApproval: true, maxCarryOverDays: 5, allowNegativeBalance: false },
  attendance: { gracePeriodMinutes: 15, autoCheckoutHours: 10, requireApproval: true },
  notifications: { emailEnabled: false, leaveReminderDays: 3, documentExpiryDays: 30 },
};

const OrgConfigPanel = () => {
  const { org } = useOrg();
  const { enqueueSnackbar } = useSnackbar();
  const orgId = org?.id || org?._id || org?.currentOrg;
  const [form, setForm] = React.useState(defaultForm);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    API.settings
      .get(orgId)
      .then((res) => {
        if (res?.success && res.settings) {
          setForm({
            payroll: { ...defaultForm.payroll, ...res.settings.payroll },
            leave: { ...defaultForm.leave, ...res.settings.leave },
            attendance: { ...defaultForm.attendance, ...res.settings.attendance },
            notifications: { ...defaultForm.notifications, ...res.settings.notifications },
          });
        }
      })
      .finally(() => setLoading(false));
  }, [orgId]);

  const updateSection = (section, field, value) => {
    setForm((f) => ({
      ...f,
      [section]: { ...f[section], [field]: value },
    }));
  };

  const handleSave = async () => {
    if (!orgId) return;
    setSaving(true);
    const res = await API.settings.update(orgId, form);
    setSaving(false);
    if (res?.success) {
      enqueueSnackbar("Settings saved.", { variant: "success" });
    } else {
      enqueueSnackbar(res?.error || "Save failed.", { variant: "error" });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payroll
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Currency"
            value={form.payroll.currency}
            onChange={(e) => updateSection("payroll", "currency", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            type="number"
            label="Pay day"
            value={form.payroll.payDay}
            onChange={(e) => updateSection("payroll", "payDay", Number(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            type="number"
            label="Tax rate (%)"
            value={form.payroll.taxRate}
            onChange={(e) => updateSection("payroll", "taxRate", Number(e.target.value))}
          />
        </Grid>
      </Grid>

      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          Leave policy
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={form.leave.requireApproval}
              onChange={(e) => updateSection("leave", "requireApproval", e.target.checked)}
            />
          }
          label="Require approval for leave requests"
        />
        <TextField
          fullWidth
          type="number"
          label="Max carry-over days"
          value={form.leave.maxCarryOverDays}
          onChange={(e) => updateSection("leave", "maxCarryOverDays", Number(e.target.value))}
          margin="normal"
        />
      </Box>

      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          Attendance
        </Typography>
        <TextField
          fullWidth
          type="number"
          label="Grace period (minutes)"
          value={form.attendance.gracePeriodMinutes}
          onChange={(e) =>
            updateSection("attendance", "gracePeriodMinutes", Number(e.target.value))
          }
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.attendance.requireApproval}
              onChange={(e) =>
                updateSection("attendance", "requireApproval", e.target.checked)
              }
            />
          }
          label="Require approval for manual attendance edits"
        />
      </Box>

      <PermissionGate permission={PERMISSIONS.SETTINGS_WRITE}>
        <Box mt={3}>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </Box>
      </PermissionGate>
    </Box>
  );
};

export default OrgConfigPanel;
