import React from "react";

import {
  Box,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(2),
  },
  title: {
    textShadow: "0.5px 0.5px 0.5px #000",
    fontFamily: "Poppins",
  },
  money: {
    color: "#00c853",
    fontFamily: "Poppins",
  },
  textWithBorder: {
    border: "2px solid #f4f6f8",
    padding: theme.spacing(1),
    borderRadius: "5px",
    marginTop: "10px",
    fontFamily: "Poppins",
  },
}));
const PayrollMetadata = ({ metadata }) => {
  const classes = useStyles();

  const {
    title,
    fromDate,
    toDate,
    frequency,
    payDate,
    employeesCount,
    totalPayment,
  } = metadata;
  return (
    <Card className={classes.card}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} align="left">
            <Typography variant="h1" gutterBottom className={classes.title}>
              <AccountBalanceIcon style={{ marginRight: "6px" }} />
              {title}
            </Typography>
            <Typography variant="h6" className={classes.textWithBorder}>
              <strong>Period: </strong>
              {new Date(fromDate).toLocaleDateString()} -{" "}
              {new Date(toDate).toLocaleDateString()}
            </Typography>
            <Typography variant="h6" className={classes.textWithBorder}>
              <strong>Frequency: </strong>
              {frequency}
            </Typography>
            <Typography variant="h6" className={classes.textWithBorder}>
              {new Date(payDate).toLocaleDateString() <
              new Date().toLocaleDateString()
                ? "Paid on: "
                : "To be paid on"}{" "}
              <strong>{payDate}</strong>
            </Typography>
          </Grid>
          <Grid item sm={6} align="center" style={{ marginTop: "2.3rem" }}>
            <Grid display="flex" justifyContent="flex-end" flexDirection="row">
              <Typography
                variant="h3"
                align="right"
                gutterBottom
                className={classes.textWithBorder}
              >
                <strong> {employeesCount} </strong> E m p l o y e e
              </Typography>
              <Typography
                variant="h1"
                align="right"
                gutterBottom
                className={classes.textWithBorder}
                style={{ color: "#009688" }}
              >
                {parseInt(totalPayment)} ETB
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PayrollMetadata;
