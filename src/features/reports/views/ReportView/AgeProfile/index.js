import React from "react";
import { Box, CircularProgress, useTheme } from "@mui/material";
import PageView from "components/PageView";
import CardWithTitle from "components/CardWithTitle";
import BarGraphComponent from "components/BarGraphComponent";
import { analyticsApi } from "features/platform/api";

const AgeProfile = () => {
  const theme = useTheme();
  const [byAge, setByAge] = React.useState(null);

  React.useEffect(() => {
    analyticsApi.dashboard().then((res) => {
      if (res?.success) setByAge(res.analytics?.workforce?.byAge || {});
    });
  }, []);

  const labels = Object.keys(byAge || {});
  const values = Object.values(byAge || {});

  return (
    <PageView title="Age Profile" backPath="/app/reports">
      {!byAge ? (
        <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
      ) : (
        <CardWithTitle title="Age distribution">
          {labels.length ? (
            <BarGraphComponent
              labels={labels}
              bars={[{ label: "Employees", data: values, color: theme.palette.primary.main }]}
              height={280}
            />
          ) : null}
        </CardWithTitle>
      )}
    </PageView>
  );
};

export default AgeProfile;
