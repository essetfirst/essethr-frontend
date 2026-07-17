import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import PageView from "components/PageView";
import CardWithTitle from "components/CardWithTitle";
import TableComponent from "components/TableComponent";
import PieChartComponent from "components/PieChartComponent";
import { analyticsApi } from "features/platform/api";

const COLOR_BY_GENDER = { Male: "lightgreen", Female: "salmon", Unknown: "orange", M: "lightgreen", F: "salmon" };

const GenderProfile = () => {
  const [workforce, setWorkforce] = React.useState(null);

  React.useEffect(() => {
    analyticsApi.dashboard().then((res) => {
      if (res?.success) setWorkforce(res.analytics?.workforce);
    });
  }, []);

  if (!workforce) {
    return (
      <PageView title="Gender Profile" backPath="/app/reports">
        <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
      </PageView>
    );
  }

  const total = workforce.total || 1;
  const genderRatioPieData = Object.entries(workforce.byGender || {}).map(([gender, count]) => ({
    gender,
    count,
    percentage: `${((count / total) * 100).toFixed(1)}%`,
  }));

  const genderHeadcountTable = Object.entries(workforce.genderByDepartment || {}).map(
    ([department, counts]) => ({
      department,
      male: counts.Male || 0,
      female: counts.Female || 0,
      unspecified: counts.Unknown || 0,
    }),
  );

  return (
    <PageView title="Gender Profile" backPath="/app/reports">
      <CardWithTitle title="Company gender ratio">
        <PieChartComponent
          pies={genderRatioPieData.map(({ gender, count }) => ({
            label: gender,
            datum: count,
            color: COLOR_BY_GENDER[gender] || "grey",
          }))}
          height={200}
        />
      </CardWithTitle>
      <Box mt={2}>
        <TableComponent
          size="small"
          columns={[
            { field: "gender", label: "Gender" },
            { field: "count", label: "Count" },
            { field: "percentage", label: "Percentage" },
          ]}
          data={[...genderRatioPieData, { gender: "Total", count: total, percentage: "100%" }]}
        />
      </Box>
      {genderHeadcountTable.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle1" gutterBottom>By department</Typography>
          <TableComponent
            columns={[
              { field: "department", label: "Department" },
              { field: "male", label: "Male" },
              { field: "female", label: "Female" },
              { field: "unspecified", label: "Other" },
            ]}
            data={genderHeadcountTable}
          />
        </Box>
      )}
    </PageView>
  );
};

export default GenderProfile;
