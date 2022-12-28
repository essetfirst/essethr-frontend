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
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import MoneyIcon from "@material-ui/icons/Money";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.15)",
    borderRadius: 10,
  },
  avatar: {
    backgroundColor: colors.indigo[400],
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
    color: colors.indigo[400],
  },
  differenceValue: {
    color: colors.indigo[400],
    marginRight: 8,
  },
}));

const TotalPayroll = ({ totalPayroll = 0, className, ...rest }) => {
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
              TOTAL PAYROLL
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 30 }}
            >
              <span style={{ color: "#5c6bc0" }}>{totalPayroll}</span>
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AttachMoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={2} />
        <Box mt={2} display="flex" alignItems="center">
          <MoneyIcon className={classes.differenceIcon} />
          <Typography className={classes.differenceValue}>100%</Typography>
          <Typography color="textSecondary" variant="caption">
            Cash
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

TotalPayroll.propTypes = {
  className: PropTypes.string,
  totalPayroll: PropTypes.number,
};

export default TotalPayroll;
