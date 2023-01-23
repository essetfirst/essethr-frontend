import React from "react";
import PropTypes from "prop-types";

import { Formik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  makeStyles,
  TextField,
  Typography,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1, 0),
    minWidth: 120,
  },
}));

const RequestForm = ({
  employees,
  allowances,
  leaveTypes,
  onRequestSubmitted,
  onCancel,
}) => {
  const classes = useStyles();

  const computeDateDiff = (d1, d2) => {
    return (
      Math.abs(new Date(d1).getTime() - new Date(d2).getTime()) / (24 * 3600000)
    );
  };

  const durations = [
    { label: "First half of the day", value: 1 },
    { label: "Second half of the day", value: 2 },
    { label: "Single day", value: 3 },
    { label: "Several days", value: 4 },
  ];

  return (
    <Container maxWidth="md">
      <Formik
        initialValues={{
          employeeId: -1,
          leaveType: -1,
          duration: 1,
          from: new Date().toISOString().slice(0, 10),
          to: new Date().toISOString().slice(0, 10),
          comment: "",
        }}
        validationSchema={Yup.object().shape({
          employeeId: Yup.string()
            .notOneOf(["-1"], "Chooe employee")
            .required("Choose employee"),
          leaveType: Yup.string()
            .oneOf(
              leaveTypes.map(({ value }) => value),
              "Choose a leave type"
            )
            .required("Choose a leave type"),
          duration: Yup.number()
            .oneOf(
              durations.map(({ value }) => value),
              "Specify how long are you going to be out? "
            )
            .required("Specify duration please"),
          from: Yup.date("Provide a start date")
            .min(
              new Date().toLocaleDateString(),
              "Date from past is not allowed"
            )
            .required("Specify start date of leave"),
          to: Yup.date("Provide a start date").required(
            "Specify end date of leave"
          ),
          comment: Yup.string(),
        })}
        onSubmit={(values) => {
          let requestInfo = {
            ...values,
          };

          if (values.duration === 1 || values.duration === 2) {
            requestInfo.duration = 0.5;
            requestInfo.to = values.from;
          } else if (values.duration === 3) {
            // console.log('Duration === 3, requestInfo: ', requestInfo)
            requestInfo.duration = 1;
          } else {
            requestInfo.duration = computeDateDiff(values.from, values.to);
          }

          // console.log(requestInfo);
          onRequestSubmitted(requestInfo);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box p={2}>
              <Typography variant="h3" align="center" gutterBottom>
                Request time-off
              </Typography>
              <Box flexGrow={1} mt={1} mb={1} />
              <Divider />
              <Box flexGrow={1} mt={1} mb={1} />
              <Box p={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <FormControl
                      fullWidth
                      className={classes.formControl}
                      error={Boolean(touched.employeeId && errors.employeeId)}
                      variant="outlined"
                      margin="normal"
                    >
                      <InputLabel id="employeeSelect">Employee</InputLabel>
                      <Select
                        id="employeeSelect"
                        label="Employee"
                        name="employeeId"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.employeeId}
                      >
                        <MenuItem value={-1}>Select Employee</MenuItem>
                        {employees.map(({ _id, firstName, lastName }) => (
                          <MenuItem key={_id} value={_id}>
                            {`${firstName} ${lastName}`}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {touched.employeeId && errors.employeeId}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
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
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
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
                        <MenuItem value={-1}>Choose duration</MenuItem>
                        {durations.map(({ label, value }) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {touched.duration && errors.duration}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {/* If the duration is less than a day then just a date else date range */}

                  <Grid item xs={12} sm={6}>
                    <TextField
                      className={classes.formControl}
                      error={Boolean(touched.from && errors.from)}
                      helperText={touched.from && errors.from}
                      label="Start Date"
                      type="date"
                      name="from"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.from}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className={classes.formControl}
                      error={Boolean(touched.to && errors.to)}
                      helperText={touched.to && errors.to}
                      label="End Date"
                      type="date"
                      name="to"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.to}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className={classes.formControl}
                      error={Boolean(touched.comment && errors.comment)}
                      helperText={touched.comment && errors.comment}
                      label="Comment"
                      name="comment"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.comment}
                      placeholder="Write your reason"
                      fullWidth
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                    >
                      Submit Request
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button fullWidth variant="outlined" onClick={onCancel}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

RequestForm.propTypes = {
  employees: PropTypes.array.isRequired,
  allowances: PropTypes.array.isRequired,
  leaveTypes: PropTypes.array.isRequired,
  onRequestSubmitted: PropTypes.func,
  onCancel: PropTypes.func,
};

export default RequestForm;
