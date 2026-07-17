import { fmt } from "utils/date";
import React from "react";

import { Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledTitle = styled(Typography)({});

const StyledTextWithBorder = styled(Typography)(({ theme }) => ({
  border: "1px solid #e0e0e0",
  padding: theme.spacing(1),
  borderRadius: 5,
  marginTop: "9px",
  fontFamily: "Poppins",
}));

const PayrollMetadata = ({ metadata }) => {
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
    <StyledCard>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} align="left">
            <StyledTitle variant="h1" gutterBottom>
              <AccountBalanceIcon style={{ marginRight: "6px" }} />
              {title}
            </StyledTitle>
            <StyledTextWithBorder variant="h6">
              <strong>Period: </strong>
              {fmt(fromDate, "dd MMM yyyy")} - {fmt(toDate, "dd MMM yyyy")}
            </StyledTextWithBorder>
            <StyledTextWithBorder variant="h6">
              <strong>Frequency: </strong>
              {frequency}
            </StyledTextWithBorder>
            <StyledTextWithBorder variant="h6">
              {new Date(payDate).toLocaleDateString() <
              new Date().toLocaleDateString() ? (
                <strong>Pay On: </strong>
              ) : (
                <strong>To Be Paid On: </strong>
              )}{" "}
              {payDate}
            </StyledTextWithBorder>
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
              <StyledTextWithBorder variant="h3" align="right">
                <strong style={{ marginRight: "6px" }}>
                  Total Employees :
                </strong>
                {employeesCount}
              </StyledTextWithBorder>
              <StyledTextWithBorder variant="h3" color="inherit" align="right">
                <strong style={{ marginRight: "0.5rem" }}>
                  Total Payment :
                </strong>
                {totalPayment
                  .toLocaleString("en-US", {
                    style: "currency",
                    currency: "ETB",
                  })
                  .replace(/\$/g, "")}
              </StyledTextWithBorder>
              <StyledTextWithBorder variant="h3" color="inherit" align="right">
                <strong style={{ marginRight: "0.5rem" }}>Status :</strong>
                {status === "finalized" ? (
                  <Chip label="Finalized" color="primary" />
                ) : status === "locked" ? (
                  <Chip label="Locked" color="secondary" />
                ) : status === "approved" ? (
                  <Chip label="Approved" color="primary" />
                ) : status === "pending" ? (
                  <Chip label="Pending" color="secondary" />
                ) : (
                  <Chip label={status || "Unknown"} color="default" />
                )}
              </StyledTextWithBorder>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );
};

export default PayrollMetadata;
