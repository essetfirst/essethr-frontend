import React from "react";
import PropTypes from "prop-types";
import { Box, LinearProgress, Typography } from "@mui/material";
import ActivityTimeline from "components/ActivityTimeline";
import API from "api";

export default function EmployeeActivity({ employeeId }) {
  const [activity, setActivity] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    API.employees
      .getActivity(employeeId)
      .then((res) => setActivity(res?.activity || []))
      .catch(() => setActivity([]))
      .finally(() => setLoading(false));
  }, [employeeId]);

  return (
    <Box py={2}>
      <Typography variant="subtitle1" gutterBottom>
        Activity timeline
      </Typography>
      <ActivityTimeline items={activity} loading={loading} />
    </Box>
  );
}

EmployeeActivity.propTypes = {
  employeeId: PropTypes.string,
};
