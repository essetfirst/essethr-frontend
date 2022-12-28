import React from "react";

import {
  Avatar,
  Card,
  CardContent,
  colors,
  Grid,
  makeStyles,
  Typography,
  Box,
} from "@material-ui/core";

import {
  AccessTime as AttendanceIcon,
  TimeToLeave as LeaveIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.15)",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
      height: "100%",
      width: "100%",
    },
  },
  avatar: {
    backgroundColor: colors.brown[500],
    height: 56,
    width: 56,

    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.25)",
    borderRadius: "50%",
    position: "relative",
    color: "#fff",
    fontSize: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  differenceIcon: {
    color: colors.brown[400],
    fontFamily: "Poppins",
  },
  differenceValue: {
    color: colors.brown[400],
    marginRight: theme.spacing(1),
    fontFamily: "Poppins",
  },
}));
const TotalAttendance = ({ totalAttendance = 0 }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14 }}
            >
              TOTAL ATTENDANCE
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 30 }}
            >
              {/* make totalAttendance number count up when page load */}
              <span style={{ color: "#795548" }}> {totalAttendance}</span>
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AttendanceIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={2} />
        <Box mt={2} display="flex" alignItems="center">
          <ArrowDownwardIcon className={classes.differenceIcon} />
          <Typography className={classes.differenceValue} variant="body2">
            36%
          </Typography>
          <Typography color="textSecondary" variant="caption">
            Since last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TotalAttendance;
