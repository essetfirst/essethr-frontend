import React from "react";

import {
  Avatar,
  Card,
  CardContent,
  colors,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";

import { AccessTime as AttendanceIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56,
    borderRadius: 5,
  },
}));
const TotalAttendance = ({ totalAttendance = 0 }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              TOTAL ATTENDANCE
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {totalAttendance}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar variant="square" className={classes.avatar}>
              <AttendanceIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TotalAttendance;
