import { Box, List, ListItem, Typography } from "@material-ui/core";
import React from "react";

const RecentReports = () => {
  const [reports, setReports] = React.useState([]);

  return (
    <List>
      {reports.map((report) => (
        <ListItem>
          <Box>
            <Typography></Typography>
            <Typography></Typography>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default RecentReports;
