import React from "react";

import {
  Box,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(2),
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
          <Grid item xs={12} sm={12} md={6}>
            <Typography variant="h3" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h6">
              <strong>Period: </strong>
              {new Date(fromDate).toLocaleDateString()} -{" "}
              {new Date(toDate).toLocaleDateString()}
            </Typography>
            <Typography variant="h6">
              <strong>Frequency: </strong>
              {frequency}
            </Typography>
            <Typography variant="h6">
              {new Date(payDate).toLocaleDateString() <
              new Date().toLocaleDateString()
                ? "Paid on: "
                : "To be paid on"}{" "}
              <strong>{payDate}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Typography variant="h3" align="center" gutterBottom>
              {employeesCount} employees
            </Typography>
            <Box p={2}>
              <Typography variant="h1" align="center" gutterBottom>
                {parseInt(totalPayment)} ETB
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PayrollMetadata;
