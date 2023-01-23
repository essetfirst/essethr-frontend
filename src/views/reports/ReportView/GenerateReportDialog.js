import React from "react";

import { Formik } from "formik";
import * as Yup from "yup";

import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";

import useOrg from "../../../providers/org";

// function *generateInts(from, to) {
//   let i = from;
//   while(i <= to) {
//     yield i;
//     i++;
//   }
// }

const getRange = (start, end) => {
  const range = [];
  let i = start;
  while (i <= end) {
    range.push(i);
    i++;
  }
  return range;
};

// const months = getRange(0, 11).map((i) => {
//   return new Date(new Date().setMonth(i)).toLocaleDateString().split("-")[1];
// });

const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "November",
  "December",
];
const yearOptions = getRange(2010, 2021).sort((a, b) => b - a);

const getDaysRangeOfMonth = (month, year) => {
  const fromDate = new Date(year, month, 1);
  const toDate = new Date(year, month + 1, 0);
  return {
    fromDate,
    toDate,
  };
};

const reportTypeOptions = [
  { label: "Employee", value: "employees" },
  { label: "Attendance", value: "attendance" },
  { label: "Leave", value: "leaves" },
  { label: "Payroll", value: "payroll" },
];

const GenerateForm = ({
  generateFilters,
  departmentOptions,
  onGenerate,
  onCancel,
}) => {
  return (
    <Formik
      initialValues={{
        dateRange: "lastMonth",
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        ...generateFilters,
      }}
      validationSchema={Yup.object({
        reportType: Yup.string(),
        department: Yup.string().required(),
        dateRange: Yup.string().required(),
        fromDate: Yup.date(),
        toDate: Yup.date(),
        month: Yup.number(),
        year: Yup.number(),
      })}
      onSubmit={(values) => {
        // console.log("Submitted values: ", values);
        const {
          reportType,
          department,
          dateRange,
          fromDate,
          toDate,
          month,
          year,
        } = values;
        let generateFiltersFromForm = {
          reportType,
          department,
          fromDate,
          toDate,
        };
        if (dateRange === "chooseMonth") {
          generateFiltersFromForm = {
            ...generateFiltersFromForm,
            ...getDaysRangeOfMonth(month, year),
          };
        }
        // console.log(generateFilters);
        onGenerate(generateFiltersFromForm);
      }}
    >
      {({
        values,
        touched,
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                error={Boolean(touched.reportType && errors.reportType)}
                helperText={touched.reportType && errors.reportType}
                label="Report type"
                name="reportType"
                value={values.reportType}
                onBlur={handleBlur}
                onChange={handleChange}
                variant="outlined"
                margin="dense"
                size="small"
              >
                {reportTypeOptions.map(({ label, value }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                error={Boolean(touched.department && errors.department)}
                helperText={touched.department && errors.department}
                label="Department"
                name="department"
                value={values.department}
                onChange={handleChange}
                onBlur={handleBlur}
                variant="outlined"
                margin="dense"
                size="small"
              >
                {/* <MenuItem value="ALL">ALL</MenuItem> */}
                {[{ label: "ALL", value: "ALL" }, ...departmentOptions].map(
                  ({ label, value }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                error={Boolean(touched.dateRange && errors.dateRange)}
                helperText={touched.dateRange && errors.dateRange}
                name="dateRange"
                value={values.dateRange}
                onChange={handleChange}
                variant="outlined"
                margin="dense"
                size="small"
              >
                <MenuItem value="lastMonth">Last 28 days</MenuItem>
                <MenuItem value="chooseMonth">Choose month</MenuItem>
                <MenuItem value="chooseDates">Specify custom period</MenuItem>
              </TextField>
            </Grid>
            {values.dateRange === "chooseDates" ? (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    error={Boolean(touched.fromDate && errors.fromDate)}
                    helperText={touched.fromDate && errors.fromDate}
                    label="From"
                    type="date"
                    name="fromDate"
                    value={values.fromDate}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    error={Boolean(touched.toDate && errors.toDate)}
                    helperText={touched.toDate && errors.toDate}
                    label="To"
                    type="date"
                    name="toDate"
                    value={values.toDate}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                    size="small"
                  />
                </Grid>
              </>
            ) : values.dateRange === "chooseMonth" ? (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    error={Boolean(touched.month && errors.month)}
                    helperText={touched.month && errors.month}
                    label="Month"
                    name="month"
                    value={values.month}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                    size="small"
                  >
                    {monthOptions.map((month, index) => (
                      <MenuItem key={month} value={index}>
                        {month}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    error={Boolean(touched.year && errors.year)}
                    helperText={touched.year && errors.month}
                    label="Year"
                    name="year"
                    value={values.year}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    variant="outlined"
                    margin="dense"
                    size="small"
                  >
                    {yearOptions.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </>
            ) : null}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <ButtonGroup>
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    aria-label="cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    aria-label="generate report"
                  >
                    Generate Report
                  </Button>
                </ButtonGroup>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

const GenerateReportDialog = ({
  generateFilters,
  open,
  onClose,

  onGenerate,
}) => {
  const { org } = useOrg();
  const departmentOptions = (org.departments || []).map(({ _id, name }) => ({
    label: name,
    value: _id,
  }));

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="h3" align="center">
          Generate Report
        </Typography>
        <Box p={2}>
          <Divider />
          <Box mt={2} />
          <GenerateForm
            generateFilters={generateFilters}
            departmentOptions={departmentOptions}
            onGenerate={(whatever) => {
              onGenerate(whatever);
              onClose();
            }}
            onCancel={() => onClose()}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReportDialog;
