import { fmt } from "utils/date";
import React from "react";
import { useLocation, useParams } from "react-router";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import MaleAvatar from "assets/images/male_no_profile.png";
import FemaleAvatar from "assets/images/female_no_profile.png";
import PageView from "components/PageView";
import TableComponent from "components/TableComponent";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import API from "api";

const PayslipDetailsEmployeeBrief = ({ employee }) => {
  const { name, jobTitle, phone, gender } = employee || {};
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Avatar
        src={gender === "Male" ? MaleAvatar : FemaleAvatar}
        sizes="large"
        variant="square"
        style={{ width: 128, height: 128, marginBottom: 16, borderRadius: 5 }}
      />
      <Typography variant="h3" align="center" gutterBottom>
        {name || "Employee"}
      </Typography>
      <Typography variant="h5" color="textSecondary" align="center" gutterBottom>
        {jobTitle || "—"}
      </Typography>
      {phone && (
        <Typography variant="h5" color="textSecondary" align="center" gutterBottom>
          <LocalPhoneOutlinedIcon style={{ verticalAlign: "middle", marginRight: 6 }} />
          {phone}
        </Typography>
      )}
    </Box>
  );
};

const PayslipDetailsSummary = ({ summary }) => {
  const { payrollTitle, fromDate, toDate, payDate } = summary || {};
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5} mb={5}>
      <Typography variant="h2" color="inherit" align="center" gutterBottom>
        {payrollTitle || "Payslip"}
      </Typography>
      <Typography variant="h5" color="textSecondary" align="center" gutterBottom>
        PAYROLL PERIOD
      </Typography>
      <Typography variant="h5" align="center">
        {fromDate && toDate
          ? `${fmt(fromDate, "dd MMM yyyy")} - ${fmt(toDate, "dd MMM yyyy")}`
          : "—"}
      </Typography>
      <Box mt={3} />
      <Typography variant="h5" color="textSecondary" align="center" gutterBottom>
        PAY DATE
      </Typography>
      <Typography variant="h5" align="center">
        {payDate ? fmt(payDate, "dd MMM yyyy") : "—"}
      </Typography>
    </Box>
  );
};

const PayslipDetailsView = () => {
  const location = useLocation();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(!location.state);
  const [payslip, setPayslip] = React.useState(location.state || null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (location.state || !id) return;
    setLoading(true);
    API.payroll.payslips
      .getById(id)
      .then((res) => {
        if (res?.success && res.payslip) {
          setPayslip(res.payslip);
          setError(null);
        } else {
          setError(res?.error || "Payslip not found.");
        }
      })
      .catch(() => setError("Failed to load payslip."))
      .finally(() => setLoading(false));
  }, [id, location.state]);

  if (loading) {
    return (
      <PageView title="Employee Payslip" backPath="/app/payroll">
        <Box display="flex" justifyContent="center" p={6}>
          <CircularProgress />
        </Box>
      </PageView>
    );
  }

  if (error || !payslip) {
    return (
      <PageView title="Employee Payslip" backPath="/app/payroll">
        <Typography color="error">{error || "Payslip unavailable."}</Typography>
      </PageView>
    );
  }

  const {
    organization,
    employeeName,
    employeePhone,
    employeeGender,
    employeePosition,
    payrollId,
    payrollTitle,
    fromDate,
    toDate,
    payDate,
    earnings = [],
    earningsTotal = 0,
    deductions = [],
    deductionsTotal = 0,
    netPayment = 0,
  } = payslip;

  const employeeJobTitle =
    typeof employeePosition === "object"
      ? employeePosition?.title ?? ""
      : employeePosition ?? "";

  return (
    <PageView
      backPath={payrollId ? `/app/payroll/${payrollId}` : "/app/payroll"}
      title="Employee Payslip"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography align="center" variant="h4">
                    {String(organization || "Organization").toUpperCase()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <PayslipDetailsEmployeeBrief
                    employee={{
                      name: employeeName,
                      jobTitle: employeeJobTitle,
                      phone: employeePhone,
                      gender: employeeGender,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <PayslipDetailsSummary
                    summary={{ payrollTitle, fromDate, toDate, payDate }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                {[
                  { label: "Gross Salary", value: earningsTotal, color: "#4caf50" },
                  { label: "Deducted", value: deductionsTotal, color: "#f44336", prefix: "- " },
                  { label: "Net Salary", value: netPayment, color: "#2196f3" },
                ].map(({ label, value, color, prefix = "" }) => (
                  <Grid item xs={12} sm={4} key={label}>
                    <Typography variant="h5" color="textSecondary" align="center" gutterBottom>
                      {label.toUpperCase()}
                    </Typography>
                    <Typography variant="h2" align="center" style={{ color }}>
                      <strong>
                        {prefix}
                        {Number(value || 0).toLocaleString("en-US", {
                          style: "currency",
                          currency: "ETB",
                        })}
                      </strong>
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            EARNINGS
          </Typography>
          <TableComponent
            columns={[
              { field: "desc", label: "Description" },
              { field: "hours", label: "Hours" },
              { field: "rate", label: "Rate" },
              { field: "amount", label: "Amount (ETB)" },
            ]}
            data={earnings}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center" gutterBottom>
            DEDUCTIONS
          </Typography>
          <TableComponent
            columns={[
              { field: "desc", label: "Description" },
              { field: "rate", label: "Rate" },
              { field: "amount", label: "Amount (ETB)" },
            ]}
            data={deductions}
          />
        </Grid>
      </Grid>
    </PageView>
  );
};

export default PayslipDetailsView;
