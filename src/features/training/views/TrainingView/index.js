import React from "react";
import {
  Box, Button, Paper, TextField, Typography, LinearProgress, Table, TableHead, TableRow, TableCell, TableBody,
} from "@mui/material";
import { useSnackbar } from "notistack";
import SchoolIcon from "@mui/icons-material/School";
import PageView from "components/PageView";
import TabbedComponent from "components/TabbedComponent";
import PageSkeleton from "components/PageSkeleton";
import { trainingApi } from "features/platform/api";

export default function TrainingView() {
  const { enqueueSnackbar } = useSnackbar();
  const [courses, setCourses] = React.useState([]);
  const [records, setRecords] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [courseForm, setCourseForm] = React.useState({ title: "", category: "", durationHours: "" });
  const [assignForm, setAssignForm] = React.useState({ employeeId: "", courseId: "" });

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, rRes] = await Promise.all([
        trainingApi.courses(),
        trainingApi.records({}),
      ]);
      setCourses(cRes?.courses || []);
      setRecords(rRes?.records || []);
    } catch (e) {
      enqueueSnackbar("Failed to load training data.", { variant: "error" });
    }
    setLoading(false);
  }, [enqueueSnackbar]);

  React.useEffect(() => { load(); }, [load]);

  const handleCreateCourse = async () => {
    const res = await trainingApi.createCourse({
      ...courseForm,
      durationHours: courseForm.durationHours ? Number(courseForm.durationHours) : undefined,
    });
    if (res?.success) {
      enqueueSnackbar("Course created.", { variant: "success" });
      setCourseForm({ title: "", category: "", durationHours: "" });
      load();
    }
  };

  const handleAssign = async () => {
    const res = await trainingApi.assign(assignForm);
    if (res?.success) {
      enqueueSnackbar("Course assigned.", { variant: "success" });
      load();
    }
  };

  const tabs = [
    {
      label: "Courses",
      panel: (
        <Box>
          <Paper style={{ padding: 16, marginBottom: 16 }}>
            <Box display="flex" flexWrap="wrap" gridGap={12} alignItems="flex-end">
              <TextField label="Title" size="small" value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} />
              <TextField label="Category" size="small" value={courseForm.category}
                onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })} />
              <TextField label="Hours" size="small" type="number" value={courseForm.durationHours}
                onChange={(e) => setCourseForm({ ...courseForm, durationHours: e.target.value })} />
              <Button variant="contained" color="primary" onClick={handleCreateCourse}>Add course</Button>
            </Box>
          </Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Hours</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>{c.title}</TableCell>
                  <TableCell>{c.category || "—"}</TableCell>
                  <TableCell>{c.durationHours ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ),
    },
    {
      label: "Assignments",
      panel: (
        <Box>
          <Paper style={{ padding: 16, marginBottom: 16 }}>
            <Box display="flex" flexWrap="wrap" gridGap={12} alignItems="flex-end">
              <TextField label="Employee ID" size="small" value={assignForm.employeeId}
                onChange={(e) => setAssignForm({ ...assignForm, employeeId: e.target.value })} />
              <TextField label="Course ID" size="small" value={assignForm.courseId}
                onChange={(e) => setAssignForm({ ...assignForm, courseId: e.target.value })} />
              <Button variant="contained" color="primary" onClick={handleAssign}>Assign</Button>
            </Box>
          </Paper>
          {records.map((r) => (
            <Paper key={r._id} style={{ padding: 12, marginBottom: 8 }} variant="outlined">
              <Typography variant="subtitle2">
                Employee {r.employeeId} — {r.status || "assigned"}
              </Typography>
              <Box display="flex" alignItems="center" gridGap={12} mt={1}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, r.progress || 0)}
                  style={{ flex: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2">{r.progress ?? 0}%</Typography>
              </Box>
            </Paper>
          ))}
          {!records.length && <Typography color="textSecondary">No assignments yet.</Typography>}
        </Box>
      ),
    },
  ];

  return (
    <PageView title="Training & Learning" icon={<SchoolIcon fontSize="large" />} backPath="/app/dashboard" breadcrumbs>
      {loading ? <PageSkeleton showTitle={false} showActions={false} contentRows={4} /> : (
        <TabbedComponent tabs={tabs} />
      )}
    </PageView>
  );
}
