import React from "react";

import {
  // Avatar,
  Box,
  // Card,
  Grid,
  Paper,
  //   IconButton,
  //   List,
  //   ListItem,
  //   ListItemAvatar,
  //   ListItemSecondaryAction,
  //   ListItemText,
  Typography,
  Avatar,
  Chip,
  Divider,
  // Paper,
} from "@material-ui/core";

// import CustomAvatar from "../../../../components/CustomAvatar";

const EmployeesOnLeave = ({ leaves }) => {
  if (!leaves || !(leaves.length > 0)) {
    return null;
  }

  return (
    <Box mt={1}>
      <Paper
        sx={{
          display: "flex",
        }}
      >
        <Box
          p={1}
          mb={2}
          // style={{ border: `1px solid rgba(0, 0, 0, 0.12)`, borderRadius: 5 }}
        >
          <Typography
            variant="h5"
            color="textSecondary"
            align="center"
            gutterBottom
          >
            Who's on leave today?
          </Typography>
          <Divider />

          <Box pt={2} pb={2}>
            <Grid container spacing={2}>
              {Array.isArray(leaves) && leaves.length > 0 ? (
                leaves.map(({ employee, leaveType, duration, to }, index) => (
                  <Grid key={index} item>
                    <Chip
                      avatar={
                        <Avatar src={employee.image}>{employee.name}</Avatar>
                      }
                      label={employee.name}
                      variant="outlined"
                    />
                    {/* <Chip
                avatar={
                  <Avatar alt="Natacha" src="/static/images/avatar/1.jpg" />
                }
                label="Avatar"
                variant="outlined"
              /> */}

                    {/* <Card>
                <Box p={2} display="flex" justifyContent="space-between">
                  <CustomAvatar
                    size="2"
                    alt={employee.name}
                    src={employee.image}
                  />
                  <Box ml={1}>
                    <Typography variant="h6" color="textPrimary">
                      {String(employee.name)}
                    </Typography>

                    <Typography variant="body1" color="textPrimary">
                      {String(leaveType[0]).toUpperCase() + leaveType.slice(1)}
                    </Typography>
                    <Typography variant="body2">
                      {duration === 1
                        ? "A day"
                        : duration === 0.5
                        ? "Half a day"
                        : `${duration} days`}{" "}
                      <span>
                        (returns on {new Date(to).toDateString().slice(4)})
                      </span>
                    </Typography>
                  </Box>
                </Box>
              </Card> */}
                  </Grid>
                ))
              ) : (
                <Paper
                  elevation={0}
                  style={{
                    background: "transparent",
                    padding: 16,
                    width: "100%",
                  }}
                >
                  <Box
                    p={2}
                    width="100%"
                    flex={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography variant="body2">
                      No one is on leave today!
                    </Typography>
                  </Box>
                </Paper>
              )}
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmployeesOnLeave;
