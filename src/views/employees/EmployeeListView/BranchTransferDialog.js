import React from "react";
import PropTypes from "prop-types";

import { Formik } from "formik";
import * as Yup from "yup";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";

// import API from "../../../api";

// import useAuth from "../../../providers/auth";

const BranchTransferDialog = ({ open, onClose, employee, onTransfer }) => {
  // const { auth } = useAuth();

  let orgsMap = {};
  let departmentsMap = {};
  let positionsMap = {};

  const [orgs] = React.useState([]);

  // const fetchOrganizations = React.useCallback(async () => {
  //   try {
  //     const { success, orgs, error } = await API.orgs.getAll({
  //       query: { createdBy: auth && auth.user && auth.user.email },
  //     });

  //     if (success) {
  //       if (Array.isArray(orgs) && orgs.length > 0) {
  //         setOrgs(orgs);
  //         // eslint-disable-next-line react-hooks/exhaustive-deps
  //         orgsMap = (orgs || [])
  //           .map((org) => {
  //             // eslint-disable-next-line react-hooks/exhaustive-deps
  //             departmentsMap = {
  //               ...(org.departments || []).reduce(
  //                 (o, d) => ({ ...o, [d._id]: { org: org._id, ...d } }),
  //                 {}
  //               ),
  //             };
  //             // eslint-disable-next-line react-hooks/exhaustive-deps
  //             positionsMap = {
  //               ...(org.positions || []).reduce(
  //                 (o, p) => ({ ...o, [p._id]: { org: org._id, ...p } }),
  //                 {}
  //               ),
  //             };
  //             return { [org._id]: org };
  //           })
  //           .reduce((prev, n) => Object.assign({}, prev, n), {});
  //       }
  //     } else {
  //       console.warn(error);
  //     }
  //   } catch (e) {
  //     console.warn(e.message);
  //   }
  // }, [auth]);

  // React.useEffect(() => {
  //   fetchOrganizations();
  // }, [fetchOrganizations]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="h4" align="center" gutterBottom>
          Employee Branch Transfer
        </Typography>

        <Divider />
        <Box mt={2} mb={1} />
        <Formik
          initialValues={{
            destinationOrg: -1,
            destinationDepartment: -1,
            destinationPosition: -1,
          }}
          validationSchema={Yup.object({
            destinationOrg: Yup.string().notOneOf(
              [-1, "-1", ""],
              "Pick a destination branch"
            ),

            destinationDepartment: Yup.string().notOneOf(
              [-1, "-1", ""],
              "Choose a department in the new branch for employee"
            ),

            destinationPosition: Yup.string().notOneOf(
              [-1, "-1", ""],
              "Choose a position in the new branch for employee"
            ),
          })}
          onSubmit={(values) => {
            const branchUpdate = {
              _id: employee._id,
              org: values.destinationOrg,
              department: values.destinationDepartment,
              position: values.destinationPosition,
            };
            onTransfer(branchUpdate);
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
                <Grid item sm={12} md={6}>
                  <TextField
                    fullWidth
                    label="Employee"
                    value={
                      employee.name ||
                      `${employee.firstName} ${employee.surName}`
                    }
                    variant="outlined"
                    size="small"
                    disabled
                  />
                </Grid>
                <Grid item sm={12} md={6}>
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

                <Grid item sm={12}></Grid>

                <Grid item sm={12} md={4}>
                  <TextField
                    fullWidth
                    select
                    error={Boolean(
                      touched.destinationOrg && errors.destinationOrg
                    )}
                    helperText={touched.destinationOrg && errors.destinationOrg}
                    label="Destination branch"
                    name="destinationOrg"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.destinationOrg}
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem value={-1}>{"Choose branch"}</MenuItem>
                    {orgs
                      .filter((o) => o._id !== employee.org)
                      .map(({ _id, name }) => (
                        <MenuItem value={_id} key={_id}>
                          {name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
                <Grid item sm={12} md={4}>
                  <TextField
                    fullWidth
                    select
                    error={Boolean(
                      touched.destinationDepartment &&
                        errors.destinationDepartment
                    )}
                    helperText={
                      touched.destinationDepartment &&
                      errors.destinationDepartment
                    }
                    label="Destination department"
                    name="destinationDepartment"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.destinationDepartment}
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem value={-1}>{"Choose department"}</MenuItem>
                    {Object.values(departmentsMap)
                      .filter((d) => d.org !== values.destinationOrg)
                      .map(({ _id, name }) => (
                        <MenuItem value={_id} key={_id}>
                          {name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
                <Grid item sm={12} md={4}>
                  <TextField
                    fullWidth
                    select
                    error={Boolean(
                      touched.destinationPosition && errors.destinationPosition
                    )}
                    helperText={
                      touched.destinationPosition && errors.destinationPosition
                    }
                    label="Destination position"
                    name="destinationPosition"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.destinationPosition}
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem value={-1}>{"Choose position"}</MenuItem>
                    {Object.values(positionsMap)
                      .filter((p) => p.org !== values.destinationOrg)
                      .map(({ _id, title }) => (
                        <MenuItem value={_id} key={_id}>
                          {title}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Box mt={2} />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  aria-label="transfer employee"
                >
                  Transfer
                </Button>
                <Box mt={1} />
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={onClose}
                  aria-label="cancel transfer"
                >
                  Cancel
                </Button>
              </Grid>
            </form>
          )}
        </Formik>
      </DialogContent>
      {/* <DialogActions></DialogActions> */}
    </Dialog>
  );
};

BranchTransferDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  employee: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    org: PropTypes.string,
    department: PropTypes.string,
    position: PropTypes.string,
  }),
  onTransfer: PropTypes.func.isRequired,
};

export default BranchTransferDialog;
