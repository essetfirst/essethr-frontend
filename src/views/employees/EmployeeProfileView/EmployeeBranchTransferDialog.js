import React from "react";
import PropTypes from "prop-types";

import { useNavigate } from "react-router";

import { Formik } from "formik";
import * as Yup from "yup";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import useAuth from "../../../providers/auth";

import API from "../../../api";

const types = {
  UPDATE_EMPLOYEE_REQUEST: "UPDATE_EMPLOYEE_REQUEST",
  UPDATE_EMPLOYEE_SUCCESS: "UPDATE_EMPLOYEE_SUCCESS",
  UPDATE_EMPLOYEE_FAILURE: "FETCH_EMPLOYEE_FAILURE",
};
const initialState = { message: "", isLoading: false, error: null };
const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.UPDATE_EMPLOYEE_REQUEST:
      return { ...state, isLoading: true, error: null };
    case types.UPDATE_EMPLOYEE_SUCCESS:
      return { ...state, message: payload, isLoading: false, error: null };
    case types.UPDATE_EMPLOYEE_FAILURE:
      return { ...state, isLoading: false, error };
    default:
      return state;
  }
};

const EmployeeBranchTransferDialog = ({ open, onClose, employee }) => {
  const navigate = useNavigate();

  const { auth } = useAuth();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  let orgsMap = {};
  let positionsMap = {};

  const [orgs, setOrgs] = React.useState([]);

  const fetchOrganizations = React.useCallback(() => {
    API.orgs
      .getAll({ query: { createdBy: auth && auth.user && auth.user.email } })
      .then(({ success, orgs, error }) => {
        if (success) {
          if (Array.isArray(orgs) && orgs.length > 0) {
            setOrgs(orgs);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            orgsMap = (orgs || [])
              .map((org) => {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                positionsMap = {
                  ...(org.positions || []).reduce(
                    (o, p) => ({ ...o, [p._id]: { org: org._id, ...p } }),
                    {}
                  ),
                };
                return { [org._id]: org };
              })
              .reduce((prev, n) => Object.assign({}, prev, n), {});
          }
        } else {
          console.warn(error);
        }
      })
      .catch((e) => {
        console.warn(e.message);
      });
  }, [auth]);

  // React.useEffect(() => {
  //   fetchOrganizations();
  // }, [fetchOrganizations]);

  //   React.useEffect(() => {}, []);

  const handleBranchTransfer = (update) => {
    dispatch({ type: types.UPDATE_EMPLOYEE_REQUEST });
    API.employees
      .editById(update._id)
      .then(({ success, message, error }) => {
        if (success) {
          dispatch({
            type: types.UPDATE_EMPLOYEE_SUCCESS,
            payload: message,
          });
          navigate("/app/employees", { replace: true });
        } else {
          dispatch({ type: types.UPDATE_EMPLOYEE_FAILURE, error });
        }
      })
      .catch((error) => {
        dispatch({ type: types.UPDATE_EMPLOYEE_FAILURE, error });
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Box
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          {!state.isLoading && (state.error || state.message) && (
            <Box mb={2} p={1}>
              <Alert
                onClose={onClose}
                severity={state.error ? "error" : "success"}
              >
                {state.error || "Employee transfer successful!"}
              </Alert>
            </Box>
          )}

          <Typography variant="h4" align="center" gutterBottom>
            Employee Branch Transfer
          </Typography>
          <Divider />
          <Box mt={2} />
          <Formik
            initialValues={{
              destinationOrg: -1,
              destinationPosition: -1,
            }}
            validationSchema={Yup.object({
              destinationOrg: Yup.string()
                .notOneOf([-1], '"Pick a destination branch"')
                .required("Pick a destination branch"),
              destinationPosition: Yup.string()
                .notOneOf([-1], '"Pick a position"')
                .required("Choose a position in the new branch for employee"),
            })}
            onSubmit={(values) => {
              const branchUpdate = {
                _id: employee._id,
                org: values.destinationOrg,
                position: values.destinationPosition,
              };
              handleBranchTransfer(branchUpdate);
            }}
          >
            {({
              errors,
              touched,
              values,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item sm={12}>
                    <TextField
                      fullWidth
                      label="Employee"
                      value={employee.name}
                      variant="outlined"
                      size="small"
                      disabled
                    />
                  </Grid>
                  <Grid item sm={6}>
                    <TextField
                      fullWidth
                      label="Current branch"
                      value={
                        (orgsMap[employee.org] && orgsMap[employee.org].name) ||
                        "N/A"
                      }
                      variant="outlined"
                      size="small"
                      disabled
                    />
                  </Grid>
                  <Grid item sm={6}>
                    <TextField
                      fullWidth
                      label="Current position"
                      value={
                        (positionsMap[employee.position] &&
                          positionsMap[employee.position].title) ||
                        "N/A"
                      }
                      variant="outlined"
                      size="small"
                      disabled
                    />
                  </Grid>

                  <Grid item sm={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      error={Boolean(
                        touched.destinationOrg && errors.destinationOrg
                      )}
                      helperText={
                        touched.destinationOrg && errors.destinationOrg
                      }
                      label="Destination branch"
                      name="destinationOrg"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.destinationOrg}
                      variant="outlined"
                      size="small"
                    >
                      <MenuItem value={-1} key={-1}>
                        {"Choose detination branch"}
                      </MenuItem>
                      {orgs
                        .filter((o) => o._id !== employee.org)
                        .map(({ _id, name }) => (
                          <MenuItem value={_id} key={_id}>
                            {name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>
                  <Grid item sm={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      error={Boolean(
                        touched.destinationPosition &&
                          errors.destinationPosition
                      )}
                      helperText={
                        touched.destinationPosition &&
                        errors.destinationPosition
                      }
                      label="Current position"
                      name="Destination position"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.destinationPosition}
                      variant="outlined"
                      size="small"
                    >
                      <MenuItem value={-1} key={-1}>
                        {values.destinationOrg !== -1
                          ? "Choose new position"
                          : "Choose branch"}
                      </MenuItem>
                      {Object.values(positionsMap)
                        .filter((p) => p.org !== values.destinationOrg)
                        .map(({ _id, title }) => (
                          <MenuItem value={_id} key={_id}>
                            {title}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      style={{ marginBottom: "8px" }}
                      aria-label="transfer employee"
                      disabled={state.isLoading || Boolean(state.message)}
                    >
                      Transfer
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={onClose}
                      //   style={{ margin: "8px" }}
                      aria-label="cancel transfer"
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
      <DialogActions></DialogActions>
    </Dialog>
  );
};

EmployeeBranchTransferDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  employee: PropTypes.shape({
    _id: PropTypes.string,
    org: PropTypes.string,
    position: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  onTransfer: PropTypes.func,
};

export default EmployeeBranchTransferDialog;
