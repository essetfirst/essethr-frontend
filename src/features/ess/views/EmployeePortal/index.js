import { fmt, fmtNow, subDays } from "utils/date";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@mui/material";
import { useSnackbar } from "notistack";
import PageView from "components/PageView";
import TabbedComponent from "components/TabbedComponent";
import ActivityTimeline from "components/ActivityTimeline";
import { essApi } from "features/platform/api";
import API from "api";
import MyPerformancePanel from "features/performance/components/MyPerformancePanel";

const EmployeePortal = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = React.useState({ loading: true });
  const [attendance, setAttendance] = React.useState([]);
  const [attendanceLoading, setAttendanceLoading] = React.useState(false);
  const [documents, setDocuments] = React.useState([]);
  const [docsLoading, setDocsLoading] = React.useState(false);
  const [previewDoc, setPreviewDoc] = React.useState(null);
  const [activity, setActivity] = React.useState([]);
  const [onboarding, setOnboarding] = React.useState([]);
  const [profileForm, setProfileForm] = React.useState({ firstName: "", lastName: "", phone: "" });
  const [profileSaving, setProfileSaving] = React.useState(false);
  const [leaveForm, setLeaveForm] = React.useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });
  const [leaveSubmitting, setLeaveSubmitting] = React.useState(false);

  const loadCore = React.useCallback(() => {
    setData((d) => ({ ...d, loading: true }));
    Promise.all([
      essApi.me(),
      essApi.payslips(),
      essApi.leaves(),
      essApi.announcements(),
      essApi.approvals(),
    ])
      .then(([me, payslips, leaves, announcements, approvals]) => {
        const user = me?.user;
        setData({
          loading: false,
          me: user,
          employeeId: user?.employeeId,
          payslips: payslips?.payslips || [],
          leaves: leaves?.leaves || [],
          announcements: announcements?.announcements || [],
          approvals: approvals?.requests || [],
        });
        setProfileForm({
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          phone: user?.phone || "",
        });
      })
      .catch(() => setData({ loading: false, error: true }));
  }, []);

  React.useEffect(() => {
    loadCore();
  }, [loadCore]);

  const loadAttendance = React.useCallback(async () => {
    setAttendanceLoading(true);
    try {
      const from = fmt(subDays(new Date(), 30), "yyyy-MM-dd");
      const to = fmtNow("yyyy-MM-dd");
      const res = await essApi.attendance({ from, to });
      setAttendance(res?.attendance || []);
    } catch (e) {
      enqueueSnackbar("Failed to load attendance.", { variant: "error" });
    }
    setAttendanceLoading(false);
  }, [enqueueSnackbar]);

  const loadDocuments = React.useCallback(async () => {
    setDocsLoading(true);
    try {
      const res = await essApi.documents();
      setDocuments(res?.documents || []);
    } catch {
      setDocuments([]);
    }
    setDocsLoading(false);
  }, []);

  const loadActivity = React.useCallback(async () => {
    const res = await essApi.activity();
    setActivity(res?.activity || []);
  }, []);

  const loadOnboarding = React.useCallback(async () => {
    const res = await essApi.onboarding();
    setOnboarding(res?.instances || []);
  }, []);

  React.useEffect(() => {
    if (!data.loading && data.employeeId) {
      loadDocuments();
      loadActivity();
      loadOnboarding();
    }
  }, [data.loading, data.employeeId, loadDocuments, loadActivity, loadOnboarding]);

  const handleProfileSave = async () => {
    if (!data.me?._id) return;
    setProfileSaving(true);
    try {
      const res = await API.users.editById(data.me._id, {
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phone: profileForm.phone.trim(),
      });
      if (res?.success) {
        enqueueSnackbar("Profile updated.", { variant: "success" });
        loadCore();
      } else {
        enqueueSnackbar(res?.error || "Update failed.", { variant: "error" });
      }
    } catch (e) {
      enqueueSnackbar("Update failed.", { variant: "error" });
    }
    setProfileSaving(false);
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    if (!data.employeeId || !leaveForm.fromDate || !leaveForm.toDate) {
      enqueueSnackbar("Dates are required.", { variant: "warning" });
      return;
    }
    setLeaveSubmitting(true);
    try {
      const res = await API.leaves.add({
        employeeId: data.employeeId,
        leaveType: leaveForm.leaveType || "Annual",
        fromDate: leaveForm.fromDate,
        toDate: leaveForm.toDate,
        reason: leaveForm.reason?.trim() || "",
        status: "pending",
      });
      if (res?.success) {
        enqueueSnackbar("Leave request submitted.", { variant: "success" });
        setLeaveForm({ leaveType: "", fromDate: "", toDate: "", reason: "" });
        const leavesRes = await essApi.leaves();
        setData((d) => ({ ...d, leaves: leavesRes?.leaves || [] }));
      } else {
        enqueueSnackbar(res?.error || "Request failed.", { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar("Request failed.", { variant: "error" });
    }
    setLeaveSubmitting(false);
  };

  if (data.loading) {
    return (
      <Box display="flex" justifyContent="center" p={6}>
        <CircularProgress />
      </Box>
    );
  }

  const tabs = [
    {
      label: "Overview",
      panel: (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper style={{ padding: 16, marginBottom: 8, background: "#e3f2fd" }}>
              <Typography variant="subtitle1" gutterBottom>
                Hello, {data.me?.firstName || "there"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {data.me?.role === "EMPLOYEE"
                  ? "Use this portal to request leave, view payslips, check attendance, download documents, and keep your profile up to date."
                  : "Your self-service workspace for HR tasks and updates."}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6" gutterBottom>Profile</Typography>
              <Typography>{data.me?.firstName} {data.me?.lastName}</Typography>
              <Typography color="textSecondary">{data.me?.email}</Typography>
              <Typography variant="caption" display="block">Role: {data.me?.role}</Typography>
              <Divider style={{ margin: "16px 0" }} />
              <Typography variant="subtitle2" gutterBottom>Edit contact</Typography>
              <Box component="form" display="flex" flexDirection="column" gridGap={12}>
                <TextField
                  label="First name"
                  size="small"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                />
                <TextField
                  label="Last name"
                  size="small"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                />
                <TextField
                  label="Phone"
                  size="small"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleProfileSave}
                  disabled={profileSaving}
                >
                  Save profile
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper style={{ padding: 16 }}>
              <Typography variant="h6" gutterBottom>Quick links</Typography>
              <Typography variant="body2" color="textSecondary">
                Use the tabs for payslips, attendance, leave requests, documents, and announcements.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      ),
    },
    {
      label: "Attendance",
      panel: (
        <Box>
          <Box mb={2}>
            <Button variant="outlined" size="small" onClick={loadAttendance} disabled={attendanceLoading}>
              Load last 30 days
            </Button>
          </Box>
          {attendanceLoading ? (
            <CircularProgress size={28} />
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Check in</TableCell>
                  <TableCell>Check out</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No attendance records. Click load above.</TableCell>
                  </TableRow>
                ) : (
                  attendance.map((a) => (
                    <TableRow key={a._id || `${a.date}-${a.employeeId}`}>
                      <TableCell>{fmt(a.date || a.checkin, "MMM d, yyyy")}</TableCell>
                      <TableCell>{a.checkin ? fmt(a.checkin, "HH:mm") : "—"}</TableCell>
                      <TableCell>{a.checkout ? fmt(a.checkout, "HH:mm") : "—"}</TableCell>
                      <TableCell>{a.status || "—"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Box>
      ),
    },
    {
      label: "Payslips",
      panel: (
        <List>
          {(data.payslips || []).map((p) => (
            <ListItem key={p._id} divider>
              <ListItemText
                primary={`Pay period ${p.fromDate || ""} – ${p.toDate || ""}`}
                secondary={`Net: ${p.netPay ?? p.total ?? "—"}`}
              />
              <Button
                component={RouterLink}
                to={`/app/payslips/${p._id}`}
                size="small"
                color="primary"
                variant="outlined"
              >
                View / Download
              </Button>
            </ListItem>
          ))}
          {!data.payslips?.length && <Typography color="textSecondary">No payslips.</Typography>}
        </List>
      ),
    },
    {
      label: "My Leaves",
      panel: (
        <Box>
          <Paper style={{ padding: 16, marginBottom: 16 }} variant="outlined">
            <Typography variant="subtitle1" gutterBottom>Request leave</Typography>
            <Box
              component="form"
              onSubmit={handleLeaveSubmit}
              display="flex"
              flexWrap="wrap"
              gridGap={12}
              alignItems="flex-end"
            >
              <TextField
                label="Leave type"
                size="small"
                value={leaveForm.leaveType}
                onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                style={{ minWidth: 140 }}
              />
              <TextField
                label="From"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                required
                value={leaveForm.fromDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
              />
              <TextField
                label="To"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                required
                value={leaveForm.toDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
              />
              <TextField
                label="Reason"
                size="small"
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                style={{ minWidth: 200, flex: 1 }}
              />
              <Button type="submit" variant="contained" color="primary" disabled={leaveSubmitting}>
                Submit request
              </Button>
            </Box>
          </Paper>
          <List>
            {(data.leaves || []).map((l) => (
              <ListItem key={l._id} divider>
                <ListItemText
                  primary={`${l.leaveType || l.type || "Leave"} — ${l.status || "pending"}`}
                  secondary={`${fmt(l.fromDate || l.start, "MMM d")} – ${fmt(l.toDate || l.end, "MMM d, yyyy")}`}
                />
              </ListItem>
            ))}
            {!data.leaves?.length && <Typography color="textSecondary">No leave records.</Typography>}
          </List>
        </Box>
      ),
    },
    {
      label: "Documents",
      panel: docsLoading ? (
        <CircularProgress size={28} />
      ) : (
        <Box>
          {previewDoc && (
            <Paper variant="outlined" style={{ padding: 8, marginBottom: 16 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle2">{previewDoc.title}</Typography>
                <Button size="small" onClick={() => setPreviewDoc(null)}>Close preview</Button>
              </Box>
              {(previewDoc.mimeType || "").includes("pdf") || (previewDoc.filename || "").endsWith(".pdf") ? (
                <iframe
                  title={previewDoc.title}
                  src={API.documents.downloadUrl(previewDoc._id)}
                  style={{ width: "100%", height: 420, border: "none" }}
                />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Preview not available — use Download.
                </Typography>
              )}
            </Paper>
          )}
          <List>
            {documents.map((doc) => (
              <ListItem key={doc._id} divider>
                <ListItemText primary={doc.title} secondary={doc.category} />
                <Button size="small" onClick={() => setPreviewDoc(doc)} style={{ marginRight: 8 }}>
                  Preview
                </Button>
                <Button
                  size="small"
                  color="primary"
                  href={API.documents.downloadUrl(doc._id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </Button>
              </ListItem>
            ))}
            {!documents.length && (
              <Typography color="textSecondary">No documents on file.</Typography>
            )}
          </List>
        </Box>
      ),
    },
    {
      label: "Onboarding",
      panel: (
        <Box>
          {onboarding.length === 0 ? (
            <Typography color="textSecondary">No onboarding checklist assigned.</Typography>
          ) : (
            onboarding.map((inst) => (
              <Paper key={inst._id} variant="outlined" style={{ padding: 16, marginBottom: 12 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Onboarding — {inst.progress || 0}% complete
                </Typography>
                <List dense>
                  {(inst.tasks || []).map((task) => (
                    <ListItem key={task.id ?? task.title}>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          task.completed
                            ? "Completed"
                            : task.dueDate
                            ? `Due ${fmt(task.dueDate, "MMM d, yyyy")}`
                            : "Pending"
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ))
          )}
        </Box>
      ),
    },
    {
      label: "Goals & Reviews",
      panel: (
        <MyPerformancePanel
          onNotify={({ success, message, error }) =>
            enqueueSnackbar(message || error, { variant: success ? "success" : error ? "error" : "info" })
          }
        />
      ),
    },
    {
      label: "Activity",
      panel: <ActivityTimeline items={activity} />,
    },
    {
      label: "Announcements",
      panel: (
        <List>
          {(data.announcements || []).map((a) => (
            <ListItem key={a._id} alignItems="flex-start" divider>
              <ListItemText
                primary={a.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textSecondary" display="block">
                      {a.publishedOn ? fmt(a.publishedOn, "MMM d, yyyy") : ""}
                    </Typography>
                    {a.body}
                  </>
                }
              />
            </ListItem>
          ))}
          {!data.announcements?.length && (
            <Typography color="textSecondary">No announcements.</Typography>
          )}
        </List>
      ),
    },
    {
      label: "Approvals",
      panel: (
        <List>
          {(data.approvals || []).map((r) => (
            <ListItem key={r._id} divider>
              <ListItemText primary={r.type} secondary={`Status: ${r.status}`} />
            </ListItem>
          ))}
          {!data.approvals?.length && <Typography color="textSecondary">No pending approvals.</Typography>}
        </List>
      ),
    },
  ];

  return (
    <PageView title="My Portal" backPath="/app/dashboard">
      <TabbedComponent tabs={tabs} />
    </PageView>
  );
};

export default EmployeePortal;
