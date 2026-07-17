import { addDays, fmt, startOfIsoWeek, toDate } from "utils/date";
import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
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
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import TimerIcon from "@mui/icons-material/Timer";
import PageView from "components/PageView";
import TabbedComponent from "components/TabbedComponent";
import PageSkeleton from "components/PageSkeleton";
import { shiftsApi } from "features/platform/api";
import API from "api";
import useOrg from "features/org/providers";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function employeeLabel(emp) {
  const name = `${emp.firstName || ""} ${emp.surName || emp.lastName || ""}`.trim();
  return emp.employeeId ? `${name} (${emp.employeeId})` : name || String(emp._id);
}

function buildEmployeeMap(employees) {
  return (employees || []).reduce((acc, emp) => {
    acc[String(emp._id)] = emp;
    return acc;
  }, {});
}

function applyTemplateToForm(templateId, templates, prev) {
  if (!templateId) return { ...prev, templateId: "" };
  const tpl = templates.find((t) => String(t._id) === String(templateId));
  if (!tpl) return { ...prev, templateId };
  return {
    ...prev,
    templateId: String(templateId),
    startTime: tpl.startTime || prev.startTime,
    endTime: tpl.endTime || prev.endTime,
  };
}

export default function ShiftScheduleView() {
  const { enqueueSnackbar } = useSnackbar();
  const { org, currentOrg } = useOrg();
  const [templates, setTemplates] = React.useState([]);
  const [assignments, setAssignments] = React.useState([]);
  const [employees, setEmployees] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [assigning, setAssigning] = React.useState(false);
  const [weekStart, setWeekStart] = React.useState(startOfIsoWeek());
  const [assignForm, setAssignForm] = React.useState({
    employeeId: "",
    templateId: "",
    date: "",
    startTime: "09:00",
    endTime: "17:00",
  });
  const [bulkForm, setBulkForm] = React.useState({
    employeeId: "",
    templateId: "",
    startTime: "09:00",
    endTime: "17:00",
    selectedDays: [0, 1, 2, 3, 4],
  });
  const [tplForm, setTplForm] = React.useState({
    name: "",
    startTime: "09:00",
    endTime: "17:00",
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
      // fall back to org cache
    }
    setEmployees(Array.isArray(org?.employees) ? org.employees : []);
  }, [org?.employees, currentOrg]);

  const load = React.useCallback(async () => {
    setLoading(true);
    const from = weekStart;
    const to = fmt(addDays(toDate(weekStart) || new Date(), 6), "yyyy-MM-dd");
    try {
      const [tRes, aRes] = await Promise.all([
        shiftsApi.templates(),
        shiftsApi.assignments({ from, to }),
      ]);
      setTemplates(tRes?.templates || []);
      setAssignments(aRes?.assignments || []);
    } catch (e) {
      enqueueSnackbar("Failed to load shifts.", { variant: "error" });
    }
    setLoading(false);
  }, [enqueueSnackbar, weekStart]);

  React.useEffect(() => {
    loadEmployees();
  }, [loadEmployees, currentOrg, org?._id]);

  React.useEffect(() => {
    load();
  }, [load]);

  const weekDates = WEEK_DAYS.map((_, i) =>
    fmt(addDays(toDate(weekStart) || new Date(), i), "yyyy-MM-dd"),
  );

  const templateName = (templateId) => {
    if (!templateId) return null;
    const tpl = templates.find((t) => String(t._id) === String(templateId));
    return tpl?.name || null;
  };

  const assignmentLabel = (assignment) => {
    const emp = employeeMap[String(assignment.employeeId)];
    const name = emp ? employeeLabel(emp) : assignment.employeeId;
    const tpl = templateName(assignment.templateId);
    return tpl ? `${name} · ${tpl}` : name;
  };

  const cellAssignments = (date) =>
    assignments.filter((a) => fmt(a.date, "yyyy-MM-dd") === date);

  const submitAssignment = async (payload) => {
    const res = await shiftsApi.assign({
      employeeId: payload.employeeId,
      templateId: payload.templateId || undefined,
      date: payload.date,
      startTime: payload.startTime,
      endTime: payload.endTime,
    });
    return res?.success;
  };

  const handleAssign = async () => {
    if (!assignForm.employeeId || !assignForm.date) {
      enqueueSnackbar("Select an employee and date.", { variant: "warning" });
      return;
    }
    setAssigning(true);
    try {
      const ok = await submitAssignment(assignForm);
      if (ok) {
        enqueueSnackbar("Shift assigned.", { variant: "success" });
        load();
      } else {
        enqueueSnackbar("Failed to assign shift.", { variant: "error" });
      }
    } finally {
      setAssigning(false);
    }
  };

  const handleBulkAssign = async () => {
    if (!bulkForm.employeeId) {
      enqueueSnackbar("Select an employee.", { variant: "warning" });
      return;
    }
    if (!bulkForm.selectedDays.length) {
      enqueueSnackbar("Select at least one day.", { variant: "warning" });
      return;
    }

    const dates = bulkForm.selectedDays.map((dayIndex) => weekDates[dayIndex]);
    setAssigning(true);
    try {
      const results = await Promise.all(
        dates.map((date) =>
          submitAssignment({
            employeeId: bulkForm.employeeId,
            templateId: bulkForm.templateId,
            date,
            startTime: bulkForm.startTime,
            endTime: bulkForm.endTime,
          }),
        ),
      );
      const successCount = results.filter(Boolean).length;
      if (successCount === dates.length) {
        enqueueSnackbar(`Assigned ${successCount} shift(s).`, { variant: "success" });
        load();
      } else if (successCount > 0) {
        enqueueSnackbar(`Assigned ${successCount} of ${dates.length} shifts.`, {
          variant: "warning",
        });
        load();
      } else {
        enqueueSnackbar("Failed to assign shifts.", { variant: "error" });
      }
    } finally {
      setAssigning(false);
    }
  };

  const handleCreateTemplate = async () => {
    const res = await shiftsApi.createTemplate(tplForm);
    if (res?.success) {
      enqueueSnackbar("Template saved.", { variant: "success" });
      setTplForm({ name: "", startTime: "09:00", endTime: "17:00" });
      load();
    }
  };

  const toggleBulkDay = (dayIndex) => {
    setBulkForm((prev) => {
      const selected = prev.selectedDays.includes(dayIndex)
        ? prev.selectedDays.filter((d) => d !== dayIndex)
        : [...prev.selectedDays, dayIndex].sort((a, b) => a - b);
      return { ...prev, selectedDays: selected };
    });
  };

  const employeeSelect = (value, onChange, label = "Employee") => (
    <FormControl size="small" sx={{ minWidth: 220 }}>
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-label`}
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

  const templateSelect = (value, onChange, onApplyTimes) => (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <InputLabel id="template-label">Template</InputLabel>
      <Select
        labelId="template-label"
        label="Template"
        value={value}
        onChange={(e) => onApplyTimes(e.target.value)}
      >
        <MenuItem value="">
          <em>Custom times</em>
        </MenuItem>
        {templates.map((tpl) => (
          <MenuItem key={String(tpl._id)} value={String(tpl._id)}>
            {tpl.name} ({tpl.startTime}–{tpl.endTime})
          </MenuItem>
        ))}
      </Select>
      {templates.length === 0 && (
        <FormHelperText>Create a template on the Templates tab</FormHelperText>
      )}
    </FormControl>
  );

  const tabs = [
    {
      label: "Templates",
      panel: (
        <Box>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Reusable shift patterns
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Templates define standard start/end times. Pick one when assigning shifts to auto-fill
              hours.
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1.5} alignItems="flex-end">
              <TextField
                label="Name"
                size="small"
                value={tplForm.name}
                onChange={(e) => setTplForm({ ...tplForm, name: e.target.value })}
              />
              <TextField
                label="Start"
                size="small"
                value={tplForm.startTime}
                onChange={(e) => setTplForm({ ...tplForm, startTime: e.target.value })}
              />
              <TextField
                label="End"
                size="small"
                value={tplForm.endTime}
                onChange={(e) => setTplForm({ ...tplForm, endTime: e.target.value })}
              />
              <Button variant="contained" color="primary" onClick={handleCreateTemplate}>
                Save template
              </Button>
            </Box>
          </Paper>
          {templates.length === 0 ? (
            <Typography color="textSecondary">No templates yet.</Typography>
          ) : (
            templates.map((t) => (
              <Paper key={t._id} sx={{ p: 1.5, mb: 1 }} variant="outlined">
                <Typography>{t.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {t.startTime} – {t.endTime}
                </Typography>
              </Paper>
            ))
          )}
        </Box>
      ),
    },
    {
      label: "Weekly schedule",
      panel: (
        <Box>
          <Box display="flex" flexWrap="wrap" gap={1.5} mb={2} alignItems="center">
            <TextField
              label="Week starting"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
            />
          </Box>

          <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
            <Typography variant="subtitle2" gutterBottom>
              Assign one day
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1.5} alignItems="flex-end">
              {employeeSelect(assignForm.employeeId, (employeeId) =>
                setAssignForm((prev) => ({ ...prev, employeeId })),
              )}
              {templateSelect(assignForm.templateId, null, (templateId) =>
                setAssignForm((prev) => applyTemplateToForm(templateId, templates, prev)),
              )}
              <TextField
                label="Date"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={assignForm.date}
                onChange={(e) => setAssignForm({ ...assignForm, date: e.target.value })}
              />
              <TextField
                label="Start"
                size="small"
                value={assignForm.startTime}
                onChange={(e) => setAssignForm({ ...assignForm, startTime: e.target.value })}
              />
              <TextField
                label="End"
                size="small"
                value={assignForm.endTime}
                onChange={(e) => setAssignForm({ ...assignForm, endTime: e.target.value })}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAssign}
                disabled={assigning}
              >
                {assigning ? <CircularProgress size={22} color="inherit" /> : "Assign"}
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
            <Typography variant="subtitle2" gutterBottom>
              Apply template to multiple days
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Select an employee, pick a template, choose days in this week, then apply in one
              action.
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1.5} alignItems="flex-end" mb={2}>
              {employeeSelect(bulkForm.employeeId, (employeeId) =>
                setBulkForm((prev) => ({ ...prev, employeeId })),
              )}
              {templateSelect(bulkForm.templateId, null, (templateId) =>
                setBulkForm((prev) => applyTemplateToForm(templateId, templates, prev)),
              )}
              <TextField
                label="Start"
                size="small"
                value={bulkForm.startTime}
                onChange={(e) => setBulkForm({ ...bulkForm, startTime: e.target.value })}
              />
              <TextField
                label="End"
                size="small"
                value={bulkForm.endTime}
                onChange={(e) => setBulkForm({ ...bulkForm, endTime: e.target.value })}
              />
            </Box>
            <FormGroup row>
              {WEEK_DAYS.map((day, index) => (
                <FormControlLabel
                  key={day}
                  control={
                    <Checkbox
                      checked={bulkForm.selectedDays.includes(index)}
                      onChange={() => toggleBulkDay(index)}
                    />
                  }
                  label={`${day} (${fmt(weekDates[index], "MMM d")})`}
                />
              ))}
            </FormGroup>
            <Box mt={2} display="flex" gap={1}>
              <Button
                size="small"
                onClick={() =>
                  setBulkForm((prev) => ({ ...prev, selectedDays: [0, 1, 2, 3, 4] }))
                }
              >
                Weekdays
              </Button>
              <Button
                size="small"
                onClick={() =>
                  setBulkForm((prev) => ({ ...prev, selectedDays: [0, 1, 2, 3, 4, 5, 6] }))
                }
              >
                Full week
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBulkAssign}
                disabled={assigning}
              >
                {assigning ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  `Apply to ${bulkForm.selectedDays.length} day(s)`
                )}
              </Button>
            </Box>
          </Paper>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Assignments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weekDates.map((date, i) => (
                <TableRow key={date}>
                  <TableCell>{WEEK_DAYS[i]}</TableCell>
                  <TableCell>{fmt(date, "MMM d")}</TableCell>
                  <TableCell>
                    {cellAssignments(date).length === 0 ? (
                      <Typography variant="body2" color="textSecondary">
                        —
                      </Typography>
                    ) : (
                      cellAssignments(date).map((a) => (
                        <Typography key={a._id} variant="body2">
                          {assignmentLabel(a)}: {a.startTime}–{a.endTime}
                        </Typography>
                      ))
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ),
    },
  ];

  return (
    <PageView
      title="Shift Scheduling"
      icon={<TimerIcon fontSize="large" />}
      backPath="/app/dashboard"
      breadcrumbs
    >
      {loading ? (
        <PageSkeleton showTitle={false} showActions={false} contentRows={5} />
      ) : (
        <TabbedComponent tabs={tabs} />
      )}
    </PageView>
  );
}
