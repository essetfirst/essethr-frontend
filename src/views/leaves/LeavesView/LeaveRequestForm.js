import React from "react";

import { Formik } from "formik";
import * as Yup from "yup";

import {
  makeStyles,
  Box,
  TextField,
  Typography,
  Select,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Grid,
  Paper,
  // Dialog,
  // DialogContent,
} from "@material-ui/core";

import {
  DatePicker,
  DateRangeDelimiter,
  DateRangePicker,
} from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1, 0),
    minWidth: 120,
  },
}));

const LeaveRequestFormView = ({ employees, onRequestSubmitted }) => {
  const classes = useStyles();
  const [dateRange, setDateRange] = React.useState([null, null]);

  // const employees = [];
  const leaveTypes = [
    { label: "Sick leave", value: "sick" },
    { label: "Annual leave", value: "annual" },
    { value: "special", label: "Special leave" },
    { value: "unpaid", label: "Un-paid leave" },
  ];
  const durations = [
    { label: "First half of the day", value: 1 },
    { label: "Second half of the day", value: 2 },
    { label: "Single day", value: 3 },
    { label: "Several days", value: 4 },
  ];

  return (
    <Formik
      initialValues={{
        employee: -1,
        leaveType: -1,
        duration: -1,
        from: null,
        to: null,
        comment: "",
      }}
      validationSchema={Yup.object().shape({
        employee: Yup.number()
          .positive("Choose employee")
          .required("Choose employee"),
        leaveType: Yup.string()
          .oneOf(leaveTypes.map(({ value }) => value))
          .required("Choose a leave type"),
        duration: Yup.string()
          .oneOf(durations.map(({ value }) => value))
          .required("Specify duration please"),
        from: Yup.date()
          .min(new Date())
          .required("Specify start date of leave"),
        to: Yup.date().required("Specify end date of leave"),
        comment: Yup.string(),
      })}
      onSubmit={(values) => {
        // Values to be added after submission
        // status = "pending"
        // createdOn = new Date()
        const request = {
          ...values,
          _id: Math.random() % 100000,
          employee: employees[values.employee],
          duration: durations[values.duration],
          from: new Date(values.from._d).toISOString().slice(0, 10),
          to: new Date(values.to._d).toISOString().slice(0, 10),
        };
        console.log(request);
        onRequestSubmitted(request);
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Box>
            <Typography color="textPrimary" align="center" variant="h4">
              Book time-off
            </Typography>
            <Typography
              color="textSecondary"
              align="center"
              gutterBottom
              variant="body2"
            >
              Provide request details below
            </Typography>
          </Box>
          <Paper className={classes.root}>
            <FormControl
              className={classes.formControl}
              error={Boolean(touched.employee && errors.employee)}
              fullWidth
              variant="outlined"
              margin="normal"
            >
              <InputLabel id="employeeNativeSelect">Employee</InputLabel>
              <Select
                id="employeeNativeSelect"
                label="Employee"
                name="employee"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.employee}
              >
                <MenuItem value={-1}>Choose</MenuItem>
                {employees.map(({ id, name }, index) => (
                  <MenuItem key={id} value={index}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {touched.employee && errors.employee}
              </FormHelperText>
            </FormControl>
            <FormControl
              className={classes.formControl}
              error={Boolean(touched.leaveType && errors.leaveType)}
              fullWidth
              variant="outlined"
              margin="normal"
            >
              <InputLabel shrink htmlFor="leaveTypeSelect">
                Leave type
              </InputLabel>
              <Select
                id="leaveTypeSelect"
                label="Leave type"
                name="leaveType"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.leaveType}
              >
                <MenuItem value={-1}>Choose</MenuItem>
                {leaveTypes.map(({ label, value }, index) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {touched.leaveType && errors.leaveType}
              </FormHelperText>
            </FormControl>
            <FormControl
              className={classes.formControl}
              error={Boolean(touched.duration && errors.duration)}
              fullWidth
              variant="outlined"
              margin="normal"
            >
              <InputLabel shrink htmlFor="durationSelect">
                Duration
              </InputLabel>
              <Select
                id="durationSelect"
                label="Duration"
                name="duration"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.duration}
              >
                <MenuItem value={-1}>Choose</MenuItem>
                {durations.map(({ label, value }, index) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {touched.duration && errors.duration}
              </FormHelperText>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={10} md={6}>
                <DatePicker
                  label="From"
                  value={values.from}
                  onChange={(date) =>
                    handleChange({
                      target: { name: "from", value: date },
                    })
                  }
                  renderInput={(props) => (
                    <TextField
                      onBlur={handleBlur}
                      error={Boolean(touched.from && errors.from)}
                      fullWidth
                      helperText={touched.from && errors.from}
                      variant="outlined"
                      {...props}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={10} md={6}>
                <DatePicker
                  label="To"
                  value={
                    values.duration === 1 || values.duration === 2
                      ? values.from
                      : values.to
                  }
                  onChange={(date) =>
                    handleChange({ target: { name: "to", value: date } })
                  }
                  renderInput={(props) => (
                    <TextField
                      onBlur={handleBlur}
                      error={Boolean(touched.to && errors.to)}
                      fullWidth
                      helperText={touched.to && errors.to}
                      variant="outlined"
                      {...props}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <DateRangePicker
              startText="Start date"
              endText="End date"
              value={dateRange}
              onChange={(newValue) => {
                console.log(newValue);
                setDateRange(newValue);
              }}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField {...startProps} />
                  <DateRangeDelimiter> to </DateRangeDelimiter>
                  <TextField {...endProps} />
                </React.Fragment>
              )}
            />
            <TextField
              error={Boolean(touched.comment && errors.comment)}
              fullWidth
              helperText={touched.comment && errors.comment}
              label="Comment"
              margin="normal"
              name="comment"
              onBlur={handleBlur}
              onChange={handleChange}
              type="comment"
              value={values.comment}
              variant="outlined"
            />
            <Box my={2}>
              <Button
                color="primary"
                // disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Submit Request
              </Button>
            </Box>
          </Paper>
        </form>
      )}
    </Formik>
  );
};

export default LeaveRequestFormView;
