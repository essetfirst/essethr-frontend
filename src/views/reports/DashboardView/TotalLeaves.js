import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles,
} from "@material-ui/core";

import {
  ArrowUpward as ArrowUpwardIcon,
  TimeToLeave as LeaveIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.15)",
    borderRadius: 10,
  },
  avatar: {
    backgroundColor: colors.blueGrey[500],
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
    color: colors.blueGrey[400],
  },
  differenceValue: {
    color: colors.blueGrey[400],
    marginRight: theme.spacing(1),
  },
}));

const TotalLeaves = ({ employeeOnLeaveCount = 0, className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14 }}
            >
              EMPLOYEE ON LEAVE
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 30 }}
            >
              <span style={{ color: colors.blueGrey[500] }}>
                {employeeOnLeaveCount}
              </span>
            </Typography>
          </Grid>
          <Grid item>
            <Avatar variant="square" className={classes.avatar}>
              <LeaveIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={2} display="flex" alignItems="center">
          <ArrowUpwardIcon className={classes.differenceIcon} />
          <Typography className={classes.differenceValue} variant="body2">
            16%
          </Typography>
          <Typography color="textSecondary" variant="caption">
            Since last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

TotalLeaves.propTypes = {
  className: PropTypes.string,
};

export default TotalLeaves;
