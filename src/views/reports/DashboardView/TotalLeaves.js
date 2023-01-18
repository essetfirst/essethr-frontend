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

import { TimeToLeave as LeaveIcon } from "@material-ui/icons";

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
  differenceIcon: {},
  differenceValue: {
    marginRight: theme.spacing(1),
  },
}));

const TotalLeaves = ({
  totalLeaves,
  calculatePercentage,
  className,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h1"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14 }}
            >
              EMPLOYEE ON LEAVE
            </Typography>
            <Typography
              color="textSecondary"
              variant="h2"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 35 }}
            >
              <span>{totalLeaves || 0}</span>
            </Typography>
          </Grid>
          <Grid item>
            <Avatar variant="square" className={classes.avatar}>
              <LeaveIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={2} display="flex" alignItems="center">
          <Typography className={classes.differenceValue} color="textSecondary">
            {calculatePercentage}%
          </Typography>
          <Typography color="textSecondary" variant="caption">
            of total employees on leave
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
