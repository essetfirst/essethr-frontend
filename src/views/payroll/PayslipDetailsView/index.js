import React from "react";

import { useLocation } from "react-router";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  // CardHeader,
  Divider,
  Grid,
  // Paper,
  Typography,
} from "@material-ui/core";

import PageView from "../../../components/PageView";

import TableComponent from "../../../components/TableComponent";

const PayslipDetailsEmployeeBrief = ({ employee }) => {
  const { image, name, jobTitle, phone } = employee;
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Avatar
        src={image || "https://picsum.photos"}
        sizes={10}
        variant="square"
        style={{
          width: "128px",
          height: "128px",
          marginBottom: "16px",
          borderRadius: 5,
        }}
      />
      <Box ml={1}>
        <Typography variant="h3" align="center" gutterBottom>
          {name}
        </Typography>
        <Typography
          variant="h5"
          color="textSecondary"
          align="center"
          gutterBottom
        >
          {jobTitle}
        </Typography>
        <Typography align="center" variant="h6">
          {phone}
        </Typography>
      </Box>
    </Box>
  );
};

const PayslipDetailsSummary = ({ summary }) => {
  const { payrollTitle, fromDate, toDate, payDate } = summary;
  return (
    <Box>
      <Typography
        variant="h2"
        color="textSecondary"
        align="center"
        gutterBottom
      >
        {payrollTitle}
      </Typography>
      <Box mt={2} />
      <Typography
        variant="h5"
        color="textSecondary"
        align="center"
        gutterBottom
      >
        {`Payroll Period`.toUpperCase()}
      </Typography>
      <Typography variant="h5" align="center">
        {new Date(fromDate).toDateString().slice(4)} -{" "}
        {new Date(toDate).toDateString().slice(4)}
      </Typography>

      <Box mt={1} />
      <Typography
        variant="h5"
        color="textSecondary"
        align="center"
        gutterBottom
      >
        {`Pay Date`.toUpperCase()}
      </Typography>
      <Typography variant="h5" align="center">
        {new Date(payDate).toDateString()}
      </Typography>
    </Box>
  );
};

const PayslipDetailsEarningsList = ({ earnings }) => {
  return (
    <Box mt={4}>
      <Typography variant="h5" align="center" gutterBottom>
        {"EARNINGS"}
      </Typography>
      <TableComponent
        columns={[
          { field: "desc", label: "Description" },
          { field: "hours", label: "Hours", align: "right" },
          { field: "rate", label: "Hourly Rate", align: "right" },
          { field: "amount", label: "Amount (ETB)", align: "right" },
          // { field: "", label: "" },
          // { field: "", label: "" },
        ]}
        data={earnings || []}
      />
    </Box>
  );
};
const PayslipDetailsDeductionsList = ({ deductions }) => {
  return (
    <Box mt={4}>
      <Typography variant="h5" align="center" gutterBottom>
        {"DEDUCTIONS"}
      </Typography>

      <TableComponent
        columns={[
          { field: "desc", label: "Description" },
          { field: "", label: "", align: "right" },
          { field: "rate", label: "Rate", align: "right" },
          { field: "amount", label: "Amount (ETB)", align: "right" },
        ]}
        data={deductions || []}
      />
    </Box>
  );
};

const PayslipDetailsView = ({ payslip, ...rest }) => {
  const location = useLocation();

  const {
    organization,
    // employee,
    employeeImage,
    employeeName,
    employeePosition,
    employeePhone,

    payrollId,
    payrollTitle,
    fromDate,
    toDate,
    payDate,

    earnings,
    earningsTotal,
    deductions,
    deductionsTotal,
    netPayment,
  } = payslip || location.state;
  const employeeJobTitle = employeePosition.title;

  return (
    <PageView
      backPath={`/app/payroll/${payrollId ? payrollId : ""}`}
      title="Employee Payslip"
      actions={
        [
          // {
          //   label: "Create templated slip",
          //   position: "left",
          //   otherProps: { variant: "contained", color: "primary", size: "small" },
          // },
        ]
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item sm={12} md={12}>
                  <Typography variant="h2" align="center" gutterBottom>
                    {String(organization).toUpperCase()}
                  </Typography>
                </Grid>
                <Grid item sm={12} md={6}>
                  <PayslipDetailsEmployeeBrief
                    employee={{
                      image: employeeImage,
                      name: employeeName,
                      jobTitle: employeeJobTitle,
                      phone: employeePhone,
                    }}
                  />
                </Grid>
                <Grid item sm={12} md={6}>
                  <PayslipDetailsSummary
                    summary={{
                      payrollTitle,
                      fromDate,
                      toDate,
                      payDate,
                    }}
                  />
                </Grid>
                <Grid item sm={12} md={6}></Grid>
                <Grid item sm={12}>
                  <Divider />
                </Grid>
                <Grid item sm={4} md={4}>
                  <Typography
                    variant="h5"
                    color="textSecondary"
                    align="center"
                    gutterBottom
                  >
                    {"Gross Salary".toUpperCase()}
                  </Typography>
                  <Typography variant="h2" color="primary" align="center">
                    <strong>{parseInt(earningsTotal)}</strong>
                  </Typography>
                </Grid>

                <Grid item sm={4} md={4}>
                  <Typography
                    variant="h5"
                    color="textSecondary"
                    align="center"
                    gutterBottom
                  >
                    {"Deducted".toUpperCase()}
                  </Typography>
                  <Typography variant="h2" color="error" align="center">
                    <strong>-{parseInt(deductionsTotal)}</strong>
                  </Typography>
                </Grid>
                <Grid item sm={4} md={4}>
                  <Typography
                    variant="h5"
                    color="textSecondary"
                    align="center"
                    gutterBottom
                  >
                    {"Net Salary".toUpperCase()}
                  </Typography>
                  <Typography variant="h2" align="center">
                    = {parseInt(netPayment)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item sm={12} md={6}>
          <PayslipDetailsEarningsList earnings={earnings} />
        </Grid>
        <Grid item sm={12} md={6}>
          <PayslipDetailsDeductionsList deductions={deductions} />
        </Grid>
      </Grid>
    </PageView>
  );
};

export default PayslipDetailsView;
