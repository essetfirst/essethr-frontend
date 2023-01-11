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

import { AccessTime as AttendanceIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",

    boxShadow: "10px 0px 10px 0px rgba(0,0,0,0.05)",
    borderRadius: 10,
  },
  avatar: {
    backgroundColor: colors.teal[300],
    height: 56,
    width: 56,

    boxShadow: "10px 10px 10px 10px rgba(0,0,0,0.08)",
    borderRadius: 8,
    position: "relative",
    color: "#fff",
    fontSize: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  differenceIcon: {
    fontFamily: "Poppins",
  },
  differenceValue: {
    marginRight: theme.spacing(1),
    fontFamily: "Poppins",
  },
}));
const TotalAttendance = ({ totalAttendance, calculatePercentage }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h1"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14 }}
            >
              TODAY'S ATTENDED
            </Typography>
            <Typography
              color="textSecondary"
              variant="h2"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 35 }}
            >
              <span> {totalAttendance} </span>
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
          {/* <ArrowDownwardIcon className={classes.differenceIcon} /> */}
          <Typography className={classes.differenceValue} variant="body2">
            {calculatePercentage ? calculatePercentage : 0}%
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
            style={{ fontFamily: "Poppins" }}
          >
            of employees are present
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TotalAttendance;
