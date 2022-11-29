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
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";

import API from "../../api";
import { Alert } from "@material-ui/lab";

const initialValues = { message: "", error: null, isLoading: false };
const types = {
  SWIPE_REQUEST: "SWIPE_REQUEST",
  SWIPE_REQUEST_SUCCESS: "SWIPE_REQUEST_SUCCESS",
  SWIPE_REQUEST_FAILURE: "SWIPE_REQUEST_FAILURE",
};
const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.SWIPE_REQUEST:
      return { ...state, isLoading: true, error };
    case types.SWIPE_REQUEST_SUCCESS:
      return { ...state, isLoading: false, message: payload };
    case types.SWIPE_REQUEST_FAILURE:
      return { ...state, isLoading: false, error };
    default:
      return state;
  }
};

const SwipeDialog = ({ open, onClose, employees }) => {
  const [state, dispatch] = React.useReducer(reducer, initialValues);

  const handleSwipe = (values) => {
    API.attendance
      .swipe({ ...values, time: new Date(values.datetime).getTime() })
      .then(({ success, message, error }) => {
        if (success) {
          dispatch({ type: types.SWIPE_REQUEST_SUCCESS, payload: message });
        } else {
          throw new Error(error);
        }
      })
      .catch((e) => {
        console.error(`Error, ${e}`);
        dispatch({ type: types.SWIPE_REQUEST_FAILURE, error: String(e) });
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={handleSnackbarClose}>
      <DialogContent>
        <Box height="100%" p={2} justifyContent="center">
          {!state.isLoading && (state.error || state.message) && (
            <Box mb={2} p={1}>
              <Alert
                onClose={handleSnackbarClose}
                severity={state.error ? "error" : "success"}
              >
                {state.error ? state.error : state.message}
              </Alert>
            </Box>
          )}
          <Typography variant="h4" align="center" gutterBottom>
            {`Swipe dialog`}
          </Typography>
          <Divider />

          <Formik
            initialValues={{ employeeId: 0, time: Date.now() }}
            validationSchema={Yup.object({
              employeId: Yup.string()
                .required("Employee id is required")
                .notOneOf([0, "0"]),
              datetime: Yup.string(),
            })}
            onSubmit={handleSwipe}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSwipe}>
                <Grid container spacing={2}>
                  <Grid item sm={12}>
                    <TextField
                      error={Boolean(touched.employeeId && errors.employeeId)}
                      fullWidth
                      helperText={touched.employeeId && errors.employeeId}
                      margin="normal"
                      name="employeeId"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.employeeId}
                      variant="outlined"
                      select
                    >
                      {[{ id: 0, name: "Choose employee" }, ...employees].map(
                        ({ id, name }) => (
                          <MenuItem value={id} key={id}>
                            {name}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  </Grid>
                  <Grid item sm={12}>
                    <TextField
                      error={Boolean(touched.datetime && errors.datetime)}
                      fullWidth
                      helperText={touched.datetime && errors.datetime}
                      margin="normal"
                      name="datetime"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="datetime"
                      value={moment(values.datetime).format(
                        "YYYY-MM-dd HH:mm:ss"
                      )}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={handleSubmit}
                      disabled={state.isLoading}
                      aria-label="Swipe"
                    >
                      {state.isLoading ? (
                        <CircularProgress color="inherit" />
                      ) : (
                        "Swipe"
                      )}
                    </Button>
                  </Grid>
                  <Grid item sm={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={onClose}
                      aria-label="Cancel"
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

SwipeDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  employees: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })
  ),
};
export default SwipeDialog;
