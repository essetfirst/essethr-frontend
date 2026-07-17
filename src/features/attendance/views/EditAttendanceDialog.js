import { fmt } from "utils/date";
import React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, Button, CircularProgress, Dialog, DialogContent, Divider, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Alert } from "@mui/lab";

import API from "api";
import categorizeError from "helpers/categorize-error";
import { editAttendanceSchema } from "features/attendance/schemas/editAttendanceSchema";

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

const StyledRoot = styled("div")(({ theme }) => ({
}));

const EditAttendanceDialog = ({ employee, attendance, open, onClose }) => {

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
        : fmt(checkin, "HH:mm"),
      checkout: String(checkout).includes(":")
        ? checkout
        : fmt(checkout, "HH:mm"),
      status,
    };
    dispatch({ type: types.VALUE_CHANGED, payload });
  }, [attendance]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editAttendanceSchema),
    defaultValues: {
      employee: `${employee.firstName} ${employee.surName}`,
      checkin: "",
      checkout: "",
      status: "",
      date: "",
    },
  });

  React.useEffect(() => {
    reset({
      employee: `${employee.firstName} ${employee.surName}`,
      ...state.attendance,
    });
  }, [employee, reset, state.attendance]);

  const onSubmit = (values) => {
    const { date, checkin, checkout, status } = values;
    const [checkinHrs, checkinMins] = (
      (String(checkin).includes(":") && checkin) ||
      new Date(checkin).toLocaleTimeString()
    )
      .split(":")
      .map((d) => parseInt(d, 10));

    const [checkoutHrs, checkoutMins] = (
      (String(checkout).includes(":") && checkout) ||
      new Date(checkout).toLocaleTimeString()
    )
      .split(":")
      .map((d) => parseInt(d, 10));

    handleEdit({
      employeeId: employee.employeeId,
      date: new Date(date).toISOString().slice(0, 10),
      checkin:
        Number.isInteger(checkin) && !String(checkin).includes(":")
          ? checkin
          : new Date(date).setHours(checkinHrs, checkinMins),
      checkout:
        Number.isInteger(checkout) && !String(checkout).includes(":")
          ? checkout
          : new Date(date).setHours(checkoutHrs, checkoutMins),
      status,
    });
  };

  return (
    <Dialog component={StyledRoot} open={open} onClose={handleSnackbarClose}>
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

          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  fullWidth
                  label="Employee"
                  {...register("employee")}
                  variant="outlined"
                  margin="normal"
                  size="small"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  fullWidth
                  error={Boolean(errors.checkin)}
                  helperText={errors.checkin?.message}
                  label="Check in"
                  type="time"
                  {...register("checkin")}
                  variant="outlined"
                  margin="normal"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  fullWidth
                  error={Boolean(errors.checkout)}
                  helperText={errors.checkout?.message}
                  label="Check out"
                  type="time"
                  {...register("checkout")}
                  variant="outlined"
                  margin="normal"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="attendance-status"
                  fullWidth
                  select
                  error={Boolean(errors.status)}
                  helperText={errors.status?.message}
                  label="Status"
                  {...register("status")}
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
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={state.isLoading}
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
                  type="button"
                  onClick={handleSnackbarClose}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
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
