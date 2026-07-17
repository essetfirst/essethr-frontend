import { fmt } from "utils/date";
import React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
} from "@mui/material";

import API from "api";
import { Alert } from "@mui/lab";
import { swipeSchema } from "features/attendance/schemas/swipeSchema";

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(swipeSchema),
    defaultValues: {
      employeeId: 0,
      datetime: fmt(new Date(), "yyyy-MM-dd'T'HH:mm"),
    },
  });

  const datetime = watch("datetime");

  const onSubmit = (values) => {
    dispatch({ type: types.SWIPE_REQUEST });
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
    if (reason === "clickaway") return;
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
            Swipe dialog
          </Typography>
          <Divider />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item sm={12}>
                <TextField
                  error={Boolean(errors.employeeId)}
                  fullWidth
                  helperText={errors.employeeId?.message}
                  margin="normal"
                  label="Employee"
                  select
                  {...register("employeeId")}
                >
                  {[{ id: 0, name: "Choose employee" }, ...employees].map(
                    ({ id, name }) => (
                      <MenuItem value={id} key={id}>
                        {name}
                      </MenuItem>
                    ),
                  )}
                </TextField>
              </Grid>
              <Grid item sm={12}>
                <TextField
                  error={Boolean(errors.datetime)}
                  fullWidth
                  helperText={errors.datetime?.message}
                  margin="normal"
                  label="Date & time"
                  type="datetime-local"
                  value={datetime || ""}
                  onChange={(e) =>
                    setValue("datetime", e.target.value, { shouldValidate: true })
                  }
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item sm={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="small"
                  type="submit"
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
                  type="button"
                  onClick={onClose}
                  aria-label="Cancel"
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

SwipeDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  employees: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
  ),
};
export default SwipeDialog;
