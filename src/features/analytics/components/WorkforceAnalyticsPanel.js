import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Divider,
} from "@mui/material";
import useOrg from "features/org/providers";
import { analyticsApi } from "features/platform/api";
import { departmentNameFromMap } from "utils/employeeDisplay";
import arrayToMap from "utils/arrayToMap";
import BarGraphComponent from "components/BarGraphComponent";
import PieChartComponent from "components/PieChartComponent";
import {
  loadSavedViews,
  saveView,
  deleteSavedView,
  exportAnalyticsCsv,
} from "features/analytics/utils/savedViews";

const insightColor = (type) => {
  if (type === "warning") return "secondary";
  if (type === "alert") return "secondary";
  if (type === "success") return "primary";
  return "default";
};

export default function WorkforceAnalyticsPanel() {
  const theme = useTheme();
  const { org, currentOrg } = useOrg();
  const [data, setData] = React.useState(null);
  const [intelligence, setIntelligence] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [savedViews, setSavedViews] = React.useState([]);
  const [viewName, setViewName] = React.useState("");
  const [savingView, setSavingView] = React.useState(false);

  React.useEffect(() => {
    loadSavedViews().then(setSavedViews);
  }, [currentOrg, org?._id]);

  const departmentsMap = React.useMemo(
    () => arrayToMap(org?.departments || [], "_id"),
    [org?.departments],
  );

  React.useEffect(() => {
    setLoading(true);
    Promise.all([analyticsApi.dashboard(), analyticsApi.intelligence()])
      .then(([dashRes, intelRes]) => {
        if (dashRes?.success) setData(dashRes.analytics);
        if (intelRes?.success) setIntelligence(intelRes.intelligence);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentOrg, org?._id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  const w = data?.workforce || {};
  const deptLabels = Object.keys(w.byDepartment || {}).map((key) =>
    departmentNameFromMap(departmentsMap, key) !== "Unassigned" ||
    !/^[a-f0-9]{24}$/i.test(key)
      ? departmentNameFromMap(departmentsMap, key)
      : key,
  );
  const deptValues = Object.values(w.byDepartment || {});
  const intel = intelligence || {};
  const summary = intel.summary || {};

  return (
    <Box mt={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography variant="h6">Workforce analytics</Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={() => exportAnalyticsCsv(data, intelligence)}
        >
          Export CSV
        </Button>
      </Box>

      <Box mb={2} display="flex" flexWrap="wrap" gap={1} alignItems="center">
        <TextField
          size="small"
          placeholder="Save current view as…"
          value={viewName}
          onChange={(e) => setViewName(e.target.value)}
        />
        <Button
          size="small"
          variant="contained"
          color="primary"
          disabled={!viewName.trim() || savingView}
          onClick={async () => {
            if (!viewName.trim()) return;
            setSavingView(true);
            const views = await saveView(viewName.trim(), { branch: currentOrg });
            setSavedViews(views);
            setViewName("");
            setSavingView(false);
          }}
        >
          {savingView ? "Saving…" : "Save view"}
        </Button>
        {savedViews.map((v) => (
          <Chip
            key={v.name}
            size="small"
            label={v.name}
            variant="outlined"
            onDelete={async () => {
              const views = await deleteSavedView(v.name);
              setSavedViews(views);
            }}
          />
        ))}
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              HR intelligence
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography color="textSecondary" variant="body2">
                  Active employees
                </Typography>
                <Typography variant="h5">{summary.activeEmployees ?? "—"}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography color="textSecondary" variant="body2">
                  Pending leaves
                </Typography>
                <Typography variant="h5">{summary.pendingLeaves ?? "—"}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography color="textSecondary" variant="body2">
                  Open jobs
                </Typography>
                <Typography variant="h5">{summary.openJobs ?? "—"}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography color="textSecondary" variant="body2">
                  Turnover risk
                </Typography>
                <Typography variant="h5">
                  {summary.turnoverRisk != null ? `${summary.turnoverRisk}%` : "—"}
                </Typography>
              </Grid>
            </Grid>
            {(intel.insights || []).length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Insights
                </Typography>
                <List dense>
                  {(intel.insights || []).map((item, i) => (
                    <ListItem key={i} disableGutters>
                      <Chip
                        size="small"
                        label={item.type}
                        color={insightColor(item.type)}
                        sx={{ mr: 1 }}
                      />
                      <ListItemText primary={item.title} secondary={item.message} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            {(intel.recommendations || []).length > 0 && (
              <Box mt={1}>
                <Typography variant="subtitle2" gutterBottom>
                  Recommendations
                </Typography>
                {(intel.recommendations || []).map((rec, i) => (
                  <Typography key={i} variant="body2" color="textSecondary">
                    • {rec}
                  </Typography>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="textSecondary">Total employees</Typography>
            <Typography variant="h4">{w.total || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="textSecondary">Active</Typography>
            <Typography variant="h4">{w.active || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="textSecondary">Turnover rate</Typography>
            <Typography variant="h4">{data?.turnoverRate || 0}%</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography color="textSecondary">Open jobs</Typography>
            <Typography variant="h4">{data?.recruitment?.openJobs || 0}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              By department
            </Typography>
            {deptLabels.length ? (
              <BarGraphComponent
                labels={deptLabels}
                bars={[
                  { label: "Employees", data: deptValues, color: theme.palette.primary.main },
                ]}
                height={260}
              />
            ) : (
              <Typography color="textSecondary">No data</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              By gender
            </Typography>
            {Object.keys(w.byGender || {}).length ? (
              <PieChartComponent
                pies={Object.entries(w.byGender).map(([label, datum]) => ({
                  label,
                  datum,
                  color: theme.palette.primary[label === "Female" ? "light" : "main"],
                }))}
                height={260}
              />
            ) : (
              <Typography color="textSecondary">No data</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">Leave pipeline</Typography>
              <Button component={RouterLink} to="/app/leaves" size="small" color="primary">
                Drill down
              </Button>
            </Box>
            <Typography>Total: {data?.leaves?.total || 0}</Typography>
            <Typography>Pending approval: {data?.leaves?.pending || 0}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">Payroll &amp; attendance</Typography>
              <Button component={RouterLink} to="/app/payroll/list" size="small" color="primary">
                Payroll
              </Button>
            </Box>
            <Typography>Payroll runs: {data?.payroll?.runs || 0}</Typography>
            <Typography>Today&apos;s attendance: {data?.attendance?.todayCount || 0}</Typography>
            <Button
              component={RouterLink}
              to="/app/attendance"
              size="small"
              sx={{ mt: 1 }}
            >
              View attendance
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
