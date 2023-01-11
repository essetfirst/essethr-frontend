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
import LocalPhoneOutlinedIcon from "@material-ui/icons/LocalPhoneOutlined";

const PayslipDetailsEmployeeBrief = ({ employee }) => {
  const { name, jobTitle, phone, gender } = employee;
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Avatar
        src={gender === "Male" ? MaleAvatar : FemaleAvatar}
        sizes="large"
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
        <Typography
          variant="h5"
          color="textSecondary"
          align="center"
          gutterBottom
          mt={2}
        >
          <span style={{ marginRight: "6px" }}>
            <LocalPhoneOutlinedIcon
              size="small"
              style={{
                marginRight: "6px",
                display: "inline-block",
                justifyContent: "center",
                alignItems: "center",
                verticalAlign: "middle",
              }}
            />
          </span>
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
      <Typography variant="h2" color="inherit" align="center" gutterBottom>
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
        {moment(payDate).format("DD MMM YYYY")}
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
        key={earnings.id}
        columns={[
          { field: "desc", label: "Description" },
          { field: "hours", label: "Hours" },
          {
            field: "rate",
            label: "Hourly Rate",
          },
          {
            field: "amount",
            label: "Amount (ETB)",
          },
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
        key={deductions.id}
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
                      fontWeight: "lighter",
                      fontSize: "2rem",

                      fontFamily: "Poppins",
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
                  <Typography
                    variant="h2"
                    align="center"
                    style={{
                      color: "#4caf50",
                    }}
                  >
                    {/* moeny number format  */}
                    <strong>
                      {parseInt(earningsTotal).toLocaleString("en-US", {
                        style: "currency",
                        currency: "ETB",
                      })}
                    </strong>
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
                  <Typography
                    variant="h2"
                    align="center"
                    style={{
                      color: "#f44336",
                    }}
                  >
                    {/* deducting money will be ETB format and always negative */}
                    <strong>
                      - {"  "}
                      {parseInt(deductionsTotal).toLocaleString("en-US", {
                        style: "currency",
                        currency: "ETB",
                      })}
                    </strong>
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
                  <Typography
                    variant="h2"
                    align="center"
                    gutterBottom
                    style={{ color: "#2196f3" }}
                  >
                    <strong>
                      {parseInt(netPayment).toLocaleString("en-US", {
                        style: "currency",
                        currency: "ETB",
                      })}
                    </strong>
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
