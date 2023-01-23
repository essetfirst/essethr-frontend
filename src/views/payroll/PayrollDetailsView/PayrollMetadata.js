import React from "react";

import {
  Card,
  CardContent,
  Chip,
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
    border: "1px  solid #e0e0e0",
    padding: theme.spacing(1),
    borderRadius: 5,
    marginTop: "9px",
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
    status,
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
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            align="right"
            style={{ marginTop: "2.8rem", height: "100%" }}
          >
            <Grid display="flex">
              <Typography
                variant="h3"
                align="right"
                className={classes.textWithBorder}
              >
                <strong style={{ marginRight: "6px" }}>
                  Total Employees :
                </strong>
                {employeesCount}
              </Typography>
              <Typography
                variant="h3"
                color="inherit"
                align="right"
                className={classes.textWithBorder}
              >
                <strong style={{ marginRight: "0.5rem" }}>
                  Total Payment :
                </strong>
                {totalPayment
                  .toLocaleString("en-US", {
                    style: "currency",
                    currency: "ETB",
                  })
                  .replace(/\$/g, "")}
              </Typography>
              {/* if status is approved, show green dot pill , if not show red dot pill */}
              <Typography
                variant="h3"
                color="inherit"
                align="right"
                className={classes.textWithBorder}
              >
                <strong style={{ marginRight: "0.5rem" }}>Status :</strong>
                {status === "approved" ? (
                  <Chip label="Approved" color="primary" />
                ) : status === "pending" ? (
                  <Chip label="Pending" color="secondary" />
                ) : (
                  <Chip label="Rejected" color="default" />
                )}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PayrollMetadata;
