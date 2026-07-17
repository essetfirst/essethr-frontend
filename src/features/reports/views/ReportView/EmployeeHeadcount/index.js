import React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import PageView from "components/PageView";
import BarGraphComponent from "components/BarGraphComponent";
import { analyticsApi } from "features/platform/api";

const EmployeeHeadcount = () => {
  const theme = useTheme();
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    analyticsApi.dashboard().then((res) => {
      if (res?.success) setData(res.analytics?.workforce);
    });
  }, []);

  const labels = Object.keys(data?.byDepartment || {});
  const values = Object.values(data?.byDepartment || {});

  return (
    <PageView title="Employee Headcount Report" backPath="/app/reports">
      {!data ? (
        <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
      ) : (
        <>
          <Typography gutterBottom>Total employees: {data.total}</Typography>
          <Typography gutterBottom>Active: {data.active} | Inactive: {data.inactive}</Typography>
          {labels.length ? (
            <BarGraphComponent
              labels={labels}
              bars={[{ label: "Headcount", data: values, color: theme.palette.primary.main }]}
              height={280}
            />
          ) : (
            <Typography color="textSecondary">No department data.</Typography>
          )}
        </>
      )}
    </PageView>
  );
};

export default EmployeeHeadcount;
