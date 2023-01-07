import React from "react";
import PropTypes from "prop-types";

import { Formik } from "formik";
import * as Yup from "yup";

import moment from "moment";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import API from "../../api";
import categorizeError from "../../helpers/categorize-error";

const initialValues = {
  isLoading: false,
  error: null,
  message: "",
  attendance: {},
};
const types = {
  VALUE_CHANGED: "VALUE_CHANGED",
  EDIT_ATTENDANCE_REQUEST: "EDIT_ATTENDANCE_REQUEST",
  EDIT_ATTENDANCE_SUCCESS: "EDIT_ATTENDANCE_SUCCESS",
  EDIT_ATTENDANCE_FAILURE: "EDIT_ATTENDANCE_FAILURE",
  RESET_STATE: "RESET_STATE",
};
const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.VALUE_CHANGED:
      return { ...state, attendance: { ...state.attendance, ...payload } };
    case types.EDIT_ATTENDANCE_REQUEST:
      return { ...state, isLoading: true, error: null };
    case types.EDIT_ATTENDANCE_SUCCESS:
      return { ...state, isLoading: false, error: null, message: payload };
    case types.EDIT_ATTENDANCE_FAILURE:
      return { ...state, isLoading: false, error };
    case types.RESET_STATE:
      return initialValues;
    default:
      return state;
  }
};

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const EditAttendanceDialog = ({ employee, attendance, open, onClose }) => {
  const classes = useStyles();

  const [state, dispatch] = React.useReducer(reducer, initialValues);

  // React.useEffect(() => {
  //   const { _id, ...rest } = attendance;
  //   const employeeName = `${employee.firstName} ${employee.surName}`;
  //   const payload = {
  //     employee: employeeName,
  //     ...rest,
  //   };
  //   dispatch({
  //     type: types.VALUE_CHANGED,
  //     payload,
  //   });
  // }, [attendance, employee]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   let v = value;
  //   if (name === "checkin" || name == "checkout") {
  //     v = String(value).includes(":")
  //       ? value
  //       : parseInt(value) > 0
  //       ? new Date(value).toISOString().slice(11, 16)
  //       : 0;
  //   }

  //   dispatch({ type: types.VALUE_CHANGED, payload: { [name]: value } });
  // };

  // const handleSubmit = (e) => {
  //   const { orgId, employeeId, date, checkin, checkout, status } =
  //     state.attendance;
  //   console.log(
  //     "[EditAttendanceDialog]: Line 85 -> Attendance form state: ",
  //     state.attendance
  //   );

  //   const checkinTime = checkin
  //     ? new Date(
  //         `${new Date(date).toISOString().slice(0, 10)} ${checkin}`
  //       ).getTime()
  //     : checkin;
  //   const checkoutTime = checkout
  //     ? new Date(
  //         `${new Date(date).toISOString().slice(0, 10)} ${checkout}`
  //       ).getTime()
  //     : checkin;

  //   let attendanceInfo = {
  //     orgId,
  //     employeeId,
  //     date,
  //     checkin: checkinTime,
  //     checkout: checkoutTime,
  //     status,
  //   };

  //   if (checkin) {
  //     attendanceInfo["checkin"] = checkinTime;
  //   }

  //   if (checkout) {
  //     attendanceInfo["checkout"] = checkoutTime;
  //   }

  //   console.log({ attendanceInfo });

  //   handleEdit(attendanceInfo);
  // };

  const handleEdit = (data) => {
    dispatch({ type: types.EDIT_ATTENDANCE_REQUEST });
    API.attendance
      .updateAttendance(data)
      .then(({ success, message, error }) => {
        if (success) {
          dispatch({ type: types.EDIT_ATTENDANCE_SUCCESS, payload: message });
        }

        if (!success && error) {
          dispatch({
            type: types.EDIT_ATTENDANCE_FAILURE,
            error,
          });
        }
      })
      .catch((e) => {
        // console.error(e);
        dispatch({
          type: types.EDIT_ATTENDANCE_FAILURE,
          error: categorizeError(e),
        });
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch({ type: types.RESET_STATE });
    onClose();
  };

  React.useEffect(() => {
    const { orgId, employeeId, date, checkin, checkout, status } = attendance;
    const payload = {
      orgId,
      employeeId,
      date,
      checkin: String(checkin).includes(":")
        ? checkin
        : // : new Date(checkin).toISOString().slice(11, 16),
          moment(checkin).format("HH:mm"),
      checkout: String(checkout).includes(":")
        ? checkout
        : // : new Date(checkout).toISOString().slice(11, 16),
          moment(checkout).format("HH:mm"),
      status,
    };
    dispatch({ type: types.VALUE_CHANGED, payload });
  }, [attendance]);

  return (
    <Dialog className={classes.root} open={open} onClose={handleSnackbarClose}>
      <DialogContent>
        <Box height="100%" p={2} justifyContent="center">
          {!state.isLoading && (state.error || state.message) && (
            <Box mb={2} p={1}>
              <Alert
                onClose={handleSnackbarClose}
                severity={state.error ? "error" : "success"}
              >
                {state.error || state.message}
              </Alert>
            </Box>
          )}
          <Typography variant="h4" align="center" gutterBottom>
            {`Edit attendance `}
          </Typography>
          <Divider />

          <Formik
            enableReinitialize
            initialValues={{
              employee: `${employee.firstName} ${employee.surName}`,
              ...state.attendance,
            }}
            validationSchema={Yup.object({
              checkin: Yup.string(),
              checkout: Yup.string(),
              status: Yup.string(),
            })}
            onSubmit={(values) => {
              // console.log("Edit attendance values", values);
              const { date, checkin, checkout, status } = values;
              const [checkinHrs, checkinMins] = (
                (String(checkin).includes(":") && checkin) ||
                new Date(checkin).toLocaleTimeString()
              )
                .split(":")
                .map((d) => parseInt(d));

              const [checkoutHrs, checkoutMins] = (
                (String(checkout).includes(":") && checkout) ||
                new Date(checkout).toLocaleTimeString()
              )
                .split(":")
                .map((d) => parseInt(d));

              const attendanceInfo = {
                employeeId: employee.employeeId,
                date: new Date(date).toISOString().slice(0, 10),
                checkin:
                  Number.isInteger(checkin) && !String(checkin).includes(":")
                    ? checkin
                    : new Date(date).setHours(checkinHrs, checkinMins),

                // new Date(
                //     `${new Date(date).toLocaleDateString()} ${checkin}`
                //   ).getTime(),
                checkout:
                  Number.isInteger(checkout) && !String(checkout).includes(":")
                    ? checkout
                    : new Date(date).setHours(checkoutHrs, checkoutMins),

                // new Date(
                //     `${new Date(date)
                //       .toISOString()
                //       .slice(0, 10)} ${checkout}`
                //   ).getTime(),
                status,
              };
              // console.log(
              //   "[EditAttendanceDialog]: Line 171 -> Attendance info: ",
              //   attendanceInfo
              // );
              handleEdit(attendanceInfo);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit} autoComplete="off">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      fullWidth
                      label="Employee"
                      value={values.employee}
                      variant="outlined"
                      margin="normal"
                      size="small"
                      disabled={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <TextField
                      fullWidth
                      error={Boolean(touched.checkin && errors.checkin)}
                      helperText={touched.checkin && errors.checkin}
                      label="Check in"
                      type="time"
                      name="checkin"
                      value={values.checkin}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      margin="normal"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <TextField
                      fullWidth
                      error={Boolean(touched.checkout && errors.checkout)}
                      helperText={touched.checkout && errors.checkout}
                      label="Check out"
                      type="time"
                      name="checkout"
                      value={values.checkout}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      margin="normal"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      id="attendance-status"
                      fullWidth
                      select
                      error={Boolean(touched.status && errors.status)}
                      helperText={touched.status && errors.status}
                      label="Status"
                      name="status"
                      value={String(values.status).toLocaleLowerCase()}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      variant="outlined"
                      margin="normal"
                      size="small"
                    >
                      {[
                        { value: "pending", label: "Pending" },
                        { value: "approved", label: "Approved" },
                        { value: "rejected", label: "Rejected" },
                      ].map(({ label, value }) => (
                        <MenuItem key={value} value={value}>
                          {`${label}`}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color={"primary"}
                      disabled={state.isLoading}
                      onClick={handleSubmit}
                    >
                      {state.isLoading ? (
                        <CircularProgress color="primary" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleSnackbarClose}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

EditAttendanceDialog.propTypes = {
  employee: PropTypes.object.isRequired,
  attendance: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default EditAttendanceDialog;
