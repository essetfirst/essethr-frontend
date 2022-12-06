import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import MuiAlert from "@material-ui/lab/Alert";
import API from "../../api/attendance";

import {
  Button,
  MenuItem,
  Grid,
  TextField,
  Dialog,
  DialogContent,
  Box,
  Typography,
  Divider,
  CircularProgress,
} from "@material-ui/core";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const initialState = { message: "", error: null, isLoading: false };
const types = {
  RESET: "RESET",
  REGISTER_REQUEST: "REGISTER_REQUEST",
  REGISTER_REQUEST_SUCCESS: "REGISTER_REQUEST_SUCCESS",
  REGISTER_REQUEST_FAILURE: "REGISTER_REQUEST_FAILURE",
};
const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.RESET:
      return initialState;
    case types.REGISTER_REQUEST:
      return { ...state, isLoading: true, error };
    case types.REGISTER_REQUEST_SUCCESS:
      return { ...state, isLoading: false, message: payload };
    case types.REGISTER_REQUEST_FAILURE:
      return { ...state, isLoading: false, error };
    default:
      return state;
  }
};

const RegisterAttendanceDialog = ({ employees, action, open, onClose }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const handleRegister = ({ employee, time }) => {
    const employeeId = employee;
    dispatch({ type: types.REGISTER_REQUEST });
    const { name } = employees.filter((e) => e.id === employeeId)[0] || {};
    API.checkin({ employeeName: name, employeeId, time })
      .then(({ success, message, error }) => {
        if (success) {
          console.log("ddddddddddddddddd", name, time);
          dispatch({ type: types.REGISTER_REQUEST_SUCCESS, payload: message });
        } else {
          dispatch({ type: types.REGISTER_REQUEST_FAILURE, error });
        }
      })
      .catch((e) => {
        console.error(e);
        dispatch({ type: types.REGISTER_REQUEST_FAILURE, error: String(e) });
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch({ type: types.RESET });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Box height="100%" p={2} justifyContent="center">
          {!state.isLoading && (state.message || state.error) && (
            <Box mb={2} p={1}>
              <Alert
                onClose={handleSnackbarClose}
                severity={state.error ? "error" : "success"}
              >
                {state.message || state.error}
              </Alert>
            </Box>
          )}
          <Typography variant="h4" align="center" gutterBottom>
            {action
              ? action === "checkin"
                ? "Check in"
                : "Check out"
              : "Sign Attendance"}
          </Typography>
          <Divider />

          <Formik
            initialValues={{
              employee: "",
              date: new Date().toISOString().slice(0, 10),
              time:
                (new Date().getHours() > 9 ? "" : "0") +
                new Date().toLocaleTimeString().slice(0, 4),
            }}
            validationSchema={Yup.object({
              employee: Yup.string()
                .notOneOf(["none"], "Please select employee")
                .required("Select an employee"),
              date: Yup.date(),
              time: Yup.string(),
            })}
            onSubmit={(values) => {
              console.log("Time values [formik]: ", values.time);
              const [hrs, mins] = values.time
                .split(":")
                .map((d) => parseInt(d));
              const time = new Date(values.date).setHours(hrs, mins);
              console.log("Time values [custom]: ", new Date(time));
              handleRegister({
                employee: values.employee,
                time,
                device: "PC",
              });

              console.log("Valueeeeeeeeee", values);
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
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      select
                      error={Boolean(touched.employee && errors.employee)}
                      helperText={touched.employee && errors.employee}
                      label="Employee"
                      id="employee-select"
                      name="employee"
                      defaultValue={"none"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="outlined"
                      margin="normal"
                      size="small"
                    >
                      <MenuItem value="none">Choose</MenuItem>
                      {employees.map(({ id, name }) => (
                        <MenuItem key={id} value={id}>
                          {`${name}`}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <TextField
                      fullWidth
                      label="Date"
                      type="date"
                      name="date"
                      value={values.date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="outlined"
                      margin="normal"
                      size="small"
                      defaultValue={new Date().toISOString().slice(0, 10)}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <TextField
                      fullWidth
                      label="Time"
                      type="time"
                      name="time"
                      value={values.time}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      variant="outlined"
                      margin="normal"
                      size="small"
                      defaultValue={
                        (new Date().getHours() > 9 ? "" : "0") +
                        new Date().toLocaleTimeString().slice(0, 4)
                      }
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      color={
                        action
                          ? action === "checkin"
                            ? "primary"
                            : "secondary"
                          : "primary"
                      }
                      disabled={state.isLoading}
                    >
                      {state.isLoading ? (
                        <CircularProgress color="primary" />
                      ) : action ? (
                        action
                      ) : (
                        "Sign"
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

RegisterAttendanceDialog.propTypes = {
  employees: PropTypes.array.isRequired,
  action: PropTypes.oneOf(["checkin", "checkout"]).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default RegisterAttendanceDialog;
