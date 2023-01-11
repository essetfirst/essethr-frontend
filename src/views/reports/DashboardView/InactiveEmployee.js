import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors,
  Box,
} from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
const useStyles = makeStyles(() => ({
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
    marginRight: 8,
  },
}));

const InactiveEmployee = ({
  totalInactiveEmployees,
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
              variant="h1"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14 }}
              gutterBottom
            >
              INACTIVE EMPLOYEES
            </Typography>
            <Typography
              color="textSecondary"
              variant="h2"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 35 }}
            >
              <span>{totalInactiveEmployees || 0}</span>
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <ErrorOutlineIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={2} />
        <Box mt={2} display="flex" alignItems="center">
          <Typography className={classes.differenceValue} color="textSecondary">
            {calculatePercentage || 0}%
          </Typography>

          <Typography
            color="textSecondary"
            variant="body2"
            style={{
              fontFamily: "Poppins",
            }}
          >
            <span>Inactive</span> employees
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

InactiveEmployee.propTypes = {
  className: PropTypes.string,
  totalPayroll: PropTypes.number,
};

export default InactiveEmployee;
