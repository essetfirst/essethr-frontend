import React from "react";
import PropTypes from "prop-types";

import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
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
  makeStyles,
} from "@material-ui/core";

import API from "../../api/attendance";

const { reducer, initialState, types } = stateMgnt();

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },

  dialog: {
    backdropFilter: "blur(5px)",
    backgroundColor: "rgba(255, 255, 255, 0.5)",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
}));

const RegisterAttendanceDialog = ({
  employees,
  action,
  open,
  onClose,
  notify,
}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const classes = useStyles();

  const { handleCheckIn, handleCheckOut } = checkFunc();

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch({ type: types.RESET });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className={classes.dialog} fullWidth>
      <DialogContent>
        <Box height="100%" p={2} justifyContent="center">
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            style={{
              fontWeight: "bold",
              fontFamily: "Poppins",
              fontSize: "1.5rem",
            }}
          >
            {action
              ? action === "checkin"
                ? "Check in"
                : "Check out"
              : "Sign"}
          </Typography>
          {/* show current time */}
          <Typography
            variant="h6"
            align="center"
            style={{
              fontWeight: "bold",
              fontFamily: "Poppins",
              fontSize: "1rem",
            }}
            gutterBottom
          >
            {moment().format("hh:mm A")}
          </Typography>

          <Divider />

          <Formik
            initialValues={{
              employee: "none",
            }}
            validationSchema={Yup.object({
              employee: Yup.string()
                .notOneOf(["none"], "Please select employee")
                .required("Select an employee"),
            })}
            onSubmit={(values) => {
              if (action) {
                if (action === "checkin") {
                  handleCheckIn(values.employee);
                } else {
                  handleCheckOut(values.employee);
                }
              } else {
                notify({
                  message: "Please select an action",
                  variant: "error",
                });
              }
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
                      <MenuItem value="none">Choose an employee</MenuItem>
                      {employees.map(({ id, name }) => (
                        <MenuItem key={id} value={id}>
                          {`${name}`}
                        </MenuItem>
                      ))}
                    </TextField>
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
                        <CircularProgress size={24} />
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

  //LOGIC FUNCTIONS
  function checkFunc() {
    const handleCheckIn = (employee) => {
      try {
        const employeeId = employee;
        dispatch({ type: types.REGISTER_REQUEST });
        API.checkin(employeeId)
          .then(({ success, message, error }) => {
            if (success) {
              dispatch({
                type: types.REGISTER_REQUEST_SUCCESS,
                payload: message,
              });
              notify({
                message: message,
                variant: "success",
              });
            } else {
              dispatch({ type: types.REGISTER_REQUEST_FAILURE, error });
              notify({
                message: error,
                variant: "error",
              });
            }
            onClose();
          })
          .catch((e) => {
            console.error(e);
            dispatch({ type: types.REGISTER_REQUEST_FAILURE, error: e });
            notify({
              message: e.error,
              variant: "error",
            });
            onClose();
          });
      } catch (error) {
        console.error(error);
      }
    };

    const handleCheckOut = (employee) => {
      try {
        const employeeId = employee;
        dispatch({ type: types.REGISTER_REQUEST });
        API.checkout(employeeId)
          .then(({ success, message, error }) => {
            if (success) {
              dispatch({
                type: types.REGISTER_REQUEST_SUCCESS,
                payload: message,
              });
              notify({
                success: true,
                message: message,
              });
            } else {
              dispatch({ type: types.REGISTER_REQUEST_FAILURE, error });
              notify({
                success: false,
                message: "Employee already checked out",
              });
            }
            onClose();
          })
          .catch((e) => {
            dispatch({ type: types.REGISTER_REQUEST_FAILURE, error: e });
            notify({
              message: e.error,
              variant: "error",
            });
            onClose();
          });
      } catch (error) {
        console.error(error);
      }
    };
    return { handleCheckIn, handleCheckOut };
  }
};

//STATE MANAGEMENT
function stateMgnt() {
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
  return { reducer, initialState, types };
}

RegisterAttendanceDialog.propTypes = {
  employees: PropTypes.array.isRequired,

  action: PropTypes.oneOf(["checkin", "checkout"]).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

export default RegisterAttendanceDialog;
