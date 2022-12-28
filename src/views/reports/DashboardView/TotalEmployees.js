import React from "react";
import PropTypes from "prop-types";

import clsx from "clsx";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles,
  Divider,
} from "@material-ui/core";

import {
  PeopleOutlined as PeopleIcon,
  ArrowUpward as ArrowUpwardIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",

    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.15)",
    borderRadius: 10,
  },
  avatar: {
    backgroundColor: colors.teal[500],
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
    color: colors.cyan[400],
    fontFamily: "Poppins",
  },
  differenceValue: {
    color: colors.cyan[600],
    fontFamily: "Poppins",
    marginRight: theme.spacing(1),
  },
}));

const TotalEmployees = ({
  currentMonthEmployeesCount,
  lastMonthEmployeesCount,
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
              variant="h6"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14 }}
            >
              TOTAL EMPLOYEES
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
              style={{ fontWeight: 600, fontFamily: "Poppins", fontSize: 30 }}
            >
              <span style={{ color: "#00BFA6" }}>
                {" "}
                {currentMonthEmployeesCount}
              </span>
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <PeopleIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={2} />
        <Box mt={2} display="flex" alignItems="center">
          <ArrowUpwardIcon className={classes.differenceIcon} />
          <Typography className={classes.differenceValue} color="textSecondary">
            76%
          </Typography>
          <Typography color="textSecondary" variant="caption">
            Since last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

TotalEmployees.propTypes = {
  className: PropTypes.string,
};

export default TotalEmployees;
