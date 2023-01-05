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

import MaleAvatar from "../../../assets/images/male_no_profile.png";
import FemaleAvatar from "../../../assets/images/female_no_profile.png";

import PageView from "../../../components/PageView";
import moment from "moment";
import TableComponent from "../../../components/TableComponent";

const PayslipDetailsEmployeeBrief = ({ employee }) => {
  const { name, jobTitle, phone, gender } = employee;
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Avatar
        src={gender === "Male" ? MaleAvatar : FemaleAvatar}
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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt={5}
      mb={5}
    >
      <Typography
        variant="h2"
        color="textSecondary"
        align="center"
        gutterBottom
      >
        {payrollTitle}
      </Typography>
      <Box mt={1} />
      <Typography
        variant="h5"
        color="textSecondary"
        align="center"
        gutterBottom
      >
        {`Payroll Period`.toUpperCase()}
      </Typography>
      <Typography variant="h5" align="center">
        {`${moment(fromDate).format("DD MMM YYYY")} - ${moment(toDate).format(
          "DD MMM YYYY"
        )}`}
      </Typography>

      <Box mt={3} />
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
      <Typography variant="h4" align="center" gutterBottom>
        {"EARNINGS"}
      </Typography>
      <TableComponent
        columns={[
          { field: "desc", label: "Description" },
          { field: "hours", label: "Hours" },
          { field: "rate", label: "Hourly Rate" },
          { field: "amount", label: "Amount (ETB)" },
        ]}
        data={earnings || []}
      />
    </Box>
  );
};
const PayslipDetailsDeductionsList = ({ deductions }) => {
  return (
    <Box mt={2}>
      <Typography variant="h5" align="center" gutterBottom>
        {"DEDUCTIONS"}
      </Typography>

      <TableComponent
        columns={[
          { field: "desc", label: "Description" },
          { field: "rate", label: "Rate" },
          { field: "amount", label: "Amount (ETB)" },
        ]}
        data={deductions || []}
      />
    </Box>
  );
};

const PayslipDetailsView = ({ payslip }) => {
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
      // actions={[
      //   {
      //     label: "Create templated payslip",
      //     position: "left",
      //     otherProps: { variant: "contained", color: "primary", size: "small" },
      //   },
      // ]}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item sm={12} md={12}>
                  <Typography
                    align="center"
                    style={{
                      textTransform: "uppercase",
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      fontSize: "2rem",
                      lineHeight: "2.5rem",
                      letterSpacing: "0.1em",
                      marginBottom: "16px",
                    }}
                  >
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
                    {/* moeny number format  */}
                    <strong>{parseInt(earningsTotal)} ETB</strong>
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
                    <strong>-{parseInt(deductionsTotal)} ETB</strong>
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
                    <strong>{parseInt(netPayment)} ETB</strong>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item sm={12} md={12}>
          <PayslipDetailsEarningsList earnings={earnings} />
        </Grid>
        <Grid item sm={12} md={12} style={{ height: "100%" }}>
          <PayslipDetailsDeductionsList deductions={deductions} />
        </Grid>
      </Grid>
    </PageView>
  );
};

export default PayslipDetailsView;
