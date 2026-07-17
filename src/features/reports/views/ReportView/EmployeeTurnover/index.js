import React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import PageView from "components/PageView";
import BarGraphComponent from "components/BarGraphComponent";
import { analyticsApi } from "features/platform/api";

const EmployeeTurnoverReport = () => {
  const theme = useTheme();
  const [analytics, setAnalytics] = React.useState(null);

  React.useEffect(() => {
    analyticsApi.dashboard().then((res) => {
      if (res?.success) setAnalytics(res.analytics);
    });
  }, []);

  const w = analytics?.workforce || {};
  const labels = ["Active", "Inactive"];
  const values = [w.active || 0, w.inactive || 0];

  return (
    <PageView title="Employee Turnover Report" backPath="/app/reports">
      {!analytics ? (
        <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Turnover rate: {analytics.turnoverRate || 0}%
          </Typography>
          <Typography color="textSecondary" paragraph>
            Based on inactive vs total headcount in your organization.
          </Typography>
          <BarGraphComponent
            labels={labels}
            bars={[{ label: "Employees", data: values, color: theme.palette.secondary.main }]}
            height={240}
          />
        </>
      )}
    </PageView>
  );
};

export default EmployeeTurnoverReport;
