import React from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useSnackbar } from "notistack";
import useOrg from "features/org/providers";
import API from "api";
import { notificationsApi } from "features/platform/api";
import PageSkeleton from "components/PageSkeleton";
import PermissionGate from "components/PermissionGate";
import { PERMISSIONS } from "constants/permissions";

const defaultNotifications = {
  emailEnabled: false,
  leaveReminderDays: 3,
  documentExpiryDays: 30,
};

const NotificationsPanel = () => {
  const { org } = useOrg();
  const { enqueueSnackbar } = useSnackbar();
  const orgId = org?.id || org?._id || org?.currentOrg;
  const [form, setForm] = React.useState(defaultNotifications);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [testingEmail, setTestingEmail] = React.useState(false);

  React.useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    API.settings
      .get(orgId)
      .then((res) => {
        if (res?.success && res.settings?.notifications) {
          setForm({ ...defaultNotifications, ...res.settings.notifications });
        }
      })
      .finally(() => setLoading(false));
  }, [orgId]);

  const updateField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSave = async () => {
    if (!orgId) return;
    setSaving(true);
    const res = await API.settings.get(orgId);
    const current = res?.success ? res.settings : {};
    const payload = {
      ...current,
      notifications: form,
    };
    const saveRes = await API.settings.update(orgId, payload);
    setSaving(false);
    if (saveRes?.success) {
      enqueueSnackbar("Notification settings saved.", { variant: "success" });
    } else {
      enqueueSnackbar(saveRes?.error || "Save failed.", { variant: "error" });
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    const res = await notificationsApi.testEmail();
    setTestingEmail(false);
    if (res?.success) {
      enqueueSnackbar(res.message || "Test email sent.", { variant: "success" });
    } else {
      enqueueSnackbar(res?.error || "Test email failed.", { variant: "error" });
    }
  };

  if (loading) {
    return <PageSkeleton showActions={false} contentRows={3} />;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Email notifications
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Configure when the system sends email reminders to employees and managers.
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={form.emailEnabled}
            onChange={(e) => updateField("emailEnabled", e.target.checked)}
            color="primary"
          />
        }
        label="Enable email notifications"
      />

      <Box mt={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Leave reminder (days before)"
              helperText="Send a reminder this many days before leave starts"
              value={form.leaveReminderDays}
              onChange={(e) => updateField("leaveReminderDays", Number(e.target.value))}
              disabled={!form.emailEnabled}
              inputProps={{ min: 1, max: 90 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Document expiry alert (days before)"
              helperText="Alert when employee documents expire within this window"
              value={form.documentExpiryDays}
              onChange={(e) => updateField("documentExpiryDays", Number(e.target.value))}
              disabled={!form.emailEnabled}
              inputProps={{ min: 1, max: 365 }}
            />
          </Grid>
        </Grid>
      </Box>

      <PermissionGate permission={PERMISSIONS.SETTINGS_WRITE}>
        <Box mt={3} display="flex" style={{ gap: 8 }}>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save notification settings"}
          </Button>
          <Button variant="outlined" color="primary" onClick={handleTestEmail} disabled={testingEmail}>
            {testingEmail ? "Sending…" : "Send test email"}
          </Button>
        </Box>
      </PermissionGate>
    </Box>
  );
};

export default NotificationsPanel;
