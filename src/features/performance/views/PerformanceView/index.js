import React from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PageView from "components/PageView";
import TabbedComponent from "components/TabbedComponent";
import PageSkeleton from "components/PageSkeleton";
import { performanceApi } from "features/platform/api";
import API from "api";
import useOrg from "features/org/providers";
import GoalEditDialog from "features/performance/components/GoalEditDialog";
import ReviewEditDialog from "features/performance/components/ReviewEditDialog";
import {
  employeeLabel,
  buildEmployeeMap,
  resolveEmployeeName,
  goalStatusColor,
  reviewStatusColor,
  reviewStatusHelp,
} from "features/performance/utils/performanceUtils";

function EmployeeSelect({ employees, value, onChange, label = "Employee" }) {
  return (
    <FormControl size="small" sx={{ minWidth: 240 }}>
      <InputLabel id={`${label}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-select-label`}
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">
          <em>Select employee</em>
        </MenuItem>
        {employees.map((emp) => (
          <MenuItem key={String(emp._id)} value={String(emp._id)}>
            {employeeLabel(emp)}
          </MenuItem>
        ))}
      </Select>
      {employees.length === 0 && (
        <FormHelperText>No employees loaded for this branch</FormHelperText>
      )}
    </FormControl>
  );
}

export default function PerformanceView() {
  const { enqueueSnackbar } = useSnackbar();
  const { org, currentOrg } = useOrg();
  const [goals, setGoals] = React.useState([]);
  const [reviews, setReviews] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [activeGoal, setActiveGoal] = React.useState(null);
  const [activeReview, setActiveReview] = React.useState(null);
  const [goalForm, setGoalForm] = React.useState({
    employeeId: "",
    title: "",
    description: "",
    target: "",
    dueDate: "",
  });
  const [reviewForm, setReviewForm] = React.useState({
    employeeId: "",
    period: "",
    selfReview: "",
    managerReview: "",
    score: "",
  });

  const employeeMap = React.useMemo(() => buildEmployeeMap(employees), [employees]);

  const loadEmployees = React.useCallback(async () => {
    try {
      const res = await API.employees.getAll({ query: { page: 1, limit: 500 } });
      if (res?.success && Array.isArray(res.employees)) {
        setEmployees(res.employees);
        return;
      }
    } catch {
      // fall back
    }
    setEmployees(Array.isArray(org?.employees) ? org.employees : []);
  }, [org?.employees, currentOrg]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [gRes, rRes] = await Promise.all([
        performanceApi.goals({}),
        performanceApi.reviews({}),
      ]);
      setGoals(gRes?.goals || []);
      setReviews(rRes?.reviews || []);
    } catch (e) {
      enqueueSnackbar("Failed to load performance data.", { variant: "error" });
    }
    setLoading(false);
  }, [enqueueSnackbar]);

  React.useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleCreateGoal = async () => {
    if (!goalForm.employeeId || !goalForm.title.trim()) {
      enqueueSnackbar("Select an employee and enter a goal title.", { variant: "warning" });
      return;
    }
    const res = await performanceApi.createGoal(goalForm);
    if (res?.success) {
      enqueueSnackbar("Goal created.", { variant: "success" });
      setGoalForm({ employeeId: "", title: "", description: "", target: "", dueDate: "" });
      load();
    } else {
      enqueueSnackbar(res?.error || "Failed to create goal.", { variant: "error" });
    }
  };

  const handleSaveGoal = async (payload) => {
    if (!activeGoal) return;
    setSaving(true);
    try {
      const res = await performanceApi.updateGoal(activeGoal._id, payload);
      if (res?.success) {
        enqueueSnackbar("Goal updated.", { variant: "success" });
        setActiveGoal(null);
        load();
      } else {
        enqueueSnackbar(res?.error || "Update failed.", { variant: "error" });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCreateReview = async () => {
    if (!reviewForm.employeeId || !reviewForm.period.trim()) {
      enqueueSnackbar("Select an employee and enter a review period.", { variant: "warning" });
      return;
    }
    const res = await performanceApi.createReview({
      ...reviewForm,
      score: reviewForm.score !== "" ? Number(reviewForm.score) : undefined,
    });
    if (res?.success) {
      enqueueSnackbar("Review created (draft).", { variant: "success" });
      setReviewForm({
        employeeId: "",
        period: "",
        selfReview: "",
        managerReview: "",
        score: "",
      });
      load();
    } else {
      enqueueSnackbar(res?.error || "Failed to create review.", { variant: "error" });
    }
  };

  const handleSaveReview = async (payload) => {
    if (!activeReview) return;
    setSaving(true);
    try {
      const res = await performanceApi.updateReview(activeReview._id, payload);
      if (res?.success) {
        enqueueSnackbar("Review saved.", { variant: "success" });
        setActiveReview(res.review);
        load();
      } else {
        enqueueSnackbar(res?.error || "Save failed.", { variant: "error" });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitReview = async (payload) => {
    if (!activeReview) return;
    setSaving(true);
    try {
      const res = await performanceApi.submitReview(activeReview._id, payload);
      if (res?.success) {
        enqueueSnackbar(res.message || "Review submitted.", { variant: "success" });
        setActiveReview(null);
        load();
      } else {
        enqueueSnackbar(res?.error || "Submit failed.", { variant: "error" });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteReview = async (payload) => {
    if (!activeReview) return;
    setSaving(true);
    try {
      const res = await performanceApi.completeReview(activeReview._id, payload);
      if (res?.success) {
        enqueueSnackbar(res.message || "Review completed.", { variant: "success" });
        setActiveReview(null);
        load();
      } else {
        enqueueSnackbar(res?.error || "Complete failed.", { variant: "error" });
      }
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    {
      label: "Goals",
      panel: (
        <Box>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Add performance goal
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1.5} alignItems="flex-end">
              <EmployeeSelect
                employees={employees}
                value={goalForm.employeeId}
                onChange={(employeeId) => setGoalForm({ ...goalForm, employeeId })}
              />
              <TextField
                label="Title"
                size="small"
                value={goalForm.title}
                onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
              />
              <TextField
                label="Target"
                size="small"
                placeholder="e.g. 100%"
                value={goalForm.target}
                onChange={(e) => setGoalForm({ ...goalForm, target: e.target.value })}
              />
              <TextField
                label="Due date"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={goalForm.dueDate}
                onChange={(e) => setGoalForm({ ...goalForm, dueDate: e.target.value })}
              />
              <Button variant="contained" color="primary" onClick={handleCreateGoal}>
                Add goal
              </Button>
            </Box>
            <TextField
              label="Description"
              size="small"
              fullWidth
              multiline
              minRows={2}
              sx={{ mt: 1.5 }}
              value={goalForm.description}
              onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
            />
          </Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Target</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {goals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="body2" color="textSecondary">
                      No goals yet. Add one above.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                goals.map((g) => (
                  <TableRow key={g._id}>
                    <TableCell>{resolveEmployeeName(employeeMap, g.employeeId)}</TableCell>
                    <TableCell>{g.title}</TableCell>
                    <TableCell>{g.target || "—"}</TableCell>
                    <TableCell>
                      <Box minWidth={80}>
                        <Typography variant="caption">{g.progress ?? 0}%</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, Math.max(0, Number(g.progress) || 0))}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={g.status || "active"} color={goalStatusColor(g.status)} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" aria-label="Edit goal" onClick={() => setActiveGoal(g)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      ),
    },
    {
      label: "Reviews",
      panel: (
        <Box>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Start performance review (draft)
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {reviewStatusHelp("draft")} Workflow: draft → submitted → completed.
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1.5} alignItems="flex-end">
              <EmployeeSelect
                employees={employees}
                value={reviewForm.employeeId}
                onChange={(employeeId) => setReviewForm({ ...reviewForm, employeeId })}
              />
              <TextField
                label="Period"
                size="small"
                placeholder="e.g. Q2 2026"
                value={reviewForm.period}
                onChange={(e) => setReviewForm({ ...reviewForm, period: e.target.value })}
              />
              <Button variant="contained" color="primary" onClick={handleCreateReview}>
                Create review
              </Button>
            </Box>
          </Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="textSecondary">
                      No reviews yet. Create one above.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((r) => (
                  <TableRow key={r._id}>
                    <TableCell>{resolveEmployeeName(employeeMap, r.employeeId)}</TableCell>
                    <TableCell>{r.period}</TableCell>
                    <TableCell>{r.score ?? "—"}</TableCell>
                    <TableCell>
                      <Chip size="small" label={r.status} color={reviewStatusColor(r.status)} />
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => setActiveReview(r)}>
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      ),
    },
  ];

  return (
    <PageView
      title="Performance Management"
      icon={<TrendingUpIcon fontSize="large" />}
      backPath="/app/dashboard"
      breadcrumbs
    >
      {loading ? (
        <PageSkeleton showTitle={false} showActions={false} contentRows={4} />
      ) : (
        <TabbedComponent tabs={tabs} />
      )}

      <GoalEditDialog
        open={Boolean(activeGoal)}
        goal={activeGoal}
        onClose={() => setActiveGoal(null)}
        onSave={handleSaveGoal}
        saving={saving}
      />

      <ReviewEditDialog
        open={Boolean(activeReview)}
        review={activeReview}
        mode="hr"
        onClose={() => setActiveReview(null)}
        onSave={handleSaveReview}
        onSubmit={handleSubmitReview}
        onComplete={handleCompleteReview}
        saving={saving}
      />
    </PageView>
  );
}
