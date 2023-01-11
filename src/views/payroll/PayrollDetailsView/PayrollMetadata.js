import React from "react";

import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(2),
  },
  title: {},
  textWithBorder: {
    border: "5px solid #f4f6f8",
    padding: theme.spacing(2),
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
              {moment(fromDate).format("DD MMM YYYY")} -{" "}
              {moment(toDate).format("DD MMM YYYY")}
            </Typography>
            <Typography variant="h6" className={classes.textWithBorder}>
              <strong>Frequency: </strong>
              {frequency}
            </Typography>
            <Typography variant="h6" className={classes.textWithBorder}>
              {new Date(payDate).toLocaleDateString() <
              new Date().toLocaleDateString() ? (
                <strong>Pay On: </strong>
              ) : (
                <strong>To Be Paid On: </strong>
              )}{" "}
              {payDate}
            </Typography>
          </Grid>
          <Grid item sm={6} align="center" style={{ marginTop: "4.3rem" }}>
            <Grid display="flex">
              <Typography
                variant="h3"
                align="right"
                className={classes.textWithBorder}
              >
                <strong>{employeesCount}</strong> E m p l o y e e s
              </Typography>
              <Typography
                variant="h1"
                align="right"
                className={classes.textWithBorder}
                color="primary"
              >
                {totalPayment.toLocaleString("en-US", {
                  style: "currency",
                  currency: "ETB",
                })}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PayrollMetadata;
