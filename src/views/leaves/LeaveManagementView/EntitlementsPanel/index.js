import React from "react";

import { Formik } from "formik";
import * as Yup from "yup";

import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";

import API from "../../../../api";

import useOrg from "../../../../providers/org";

import arrayToMap from "../../../../utils/arrayToMap";
import TableComponent from "../../../../components/TableComponent";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";

const AllocateAllowanceDialog = ({ open, onClose, employees, onSubmit }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Box p={2}>
          <Typography
            variant="h3"
            align="center"
            style={{ fontFamily: "Poppins" }}
          >
            Allocate Allowance
          </Typography>
        </Box>

        <Formik
          initialValues={{
            employeeId: -1,
            // leaveType: -1,
            // days: 0,
          }}
          validationSchema={Yup.object().shape({
            employeeId: Yup.string()
              .required("'Employee id' is required")
              .notOneOf([-1], "'Employee id' is required"),
            // leaveType: Yup.string()
            //   .required("'Leave type' is required")
            //   .notOneOf([-1], "'Employee id' is required"),
            // days: Yup.number().positive(
            //   "'Balance in days' can not be negative"
            // ),
          })}
          onSubmit={async (
            values,
            { setSubmitting, setErrors, setStatus, resetForm }
          ) => {
            try {
              await onSubmit(values);
              resetForm();
              onClose();
            } catch (err) {
              setStatus({ success: false });

              if (err.response) {
                setErrors({ submit: err.response.data.message });
              } else {
                setErrors({ submit: err.message });
              }
            }
          }}
        >
          {({
            errors,
            touched,
            values,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Box p={2}>
                  <Grid container spacing={2}>
                    <Grid item sm={12} lg={12}>
                      <TextField
                        fullWidth
                        select
                        error={Boolean(touched.employeeId && errors.employeeId)}
                        helperText={touched.employeeId && errors.employeeId}
                        label="Employee"
                        name="employeeId"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.employeeId}
                        variant="outlined"
                      >
                        <MenuItem value={-1}>Choose employee</MenuItem>
                        {employees.map(({ _id, name }) => (
                          <MenuItem value={_id} key={_id}>
                            {name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item sm={12}>
                      <Box mt={1}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={handleSubmit}
                          disabled={values.employeeId === -1}
                          style={{ marginBottom: "16px" }}
                        >
                          Allocate
                        </Button>
                        <Button fullWidth variant="outlined" onClick={onClose}>
                          Cancel
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

const EntitlementsPanel = ({ state, notify, onFetchAllowances }) => {
  const { org } = useOrg();

  const employeesMap = arrayToMap(org.employees || [], "_id");

  const [allocateDialogOpen, setAllocateDialogOpen] = React.useState(false);
  const handleAllocateDialogClose = () => setAllocateDialogOpen(false);
  const handleAllocateClick = () => {
    setAllocateDialogOpen(true);
  };
  const handleAllocateAllowance = async (allowanceInfo) => {
    const { employeeId } = allowanceInfo;
    try {
      const { success, error } = await API.leaves.allowances.allocate({
        employeeId,
      });
      notify({ success, message: "Leave balance allocated.", error });
    } catch (e) {
      console.error(e.message);
      notify({ success: false, error: "Something went wrong." });
    }
  };

  React.useEffect(() => {
    onFetchAllowances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const employees = Object.values(employeesMap).map(
    ({ _id, firstName, surName, lastName }) => ({
      _id,
      name: `${firstName} ${surName} ${lastName}`,
    })
  );

  return (
    <div>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleAllocateClick}
            aria-label="allocate leave balance"
            startIcon={<AddCircleRoundedIcon />}
          >
            Allocate Balance
          </Button>
        </ButtonGroup>
      </Box>
      <AllocateAllowanceDialog
        open={allocateDialogOpen}
        onClose={handleAllocateDialogClose}
        employees={employees}
        onSubmit={handleAllocateAllowance}
      />
      {/* Summary usage and leave by type */}
      <TableComponent
        size="medium"
        columns={[
          {
            label: "Employee",
            field: "employeeId",
            renderCell: ({ employeeId }) => {
              if (!employeeId && !employeesMap[employeeId]) {
                return (
                  <Typography variant="h6" style={{ fontStyle: "italic" }}>
                    User Deleted
                  </Typography>
                );
              }
              const { firstName, surName } = employeesMap[employeeId] || {};
              if (!firstName && !surName) {
                return (
                  <Typography variant="h6" style={{ fontStyle: "italic" }}>
                    User Deleted
                  </Typography>
                );
              }
              const name = `${firstName} ${surName}`;
              return <Typography variant="h6">{name}</Typography>;
            },
          },
          {
            label: "Allocated",
            align: "center",
            renderCell: ({ allocated }) => {
              const { annual, special, maternal } = allocated;
              return (
                <Typography variant="h6">
                  {annual + special + maternal}
                </Typography>
              );
            },
          },
          {
            label: "Remaining",
            align: "center",
            renderCell: ({ remaining }) => {
              return <Typography variant="h6">{remaining}</Typography>;
            },
          },
          {
            label: "Annual leave",
            field: "annual",
            align: "center",
            renderCell: ({ allocated }) => (
              <Typography variant="h6">{allocated.annual}</Typography>
            ),
          },
          {
            label: "Special leave",
            field: "special",
            align: "center",
            renderCell: ({ allocated }) => (
              <Typography variant="h6">{allocated.special}</Typography>
            ),
          },
          {
            label: "Maternal leave",
            field: "maternal",
            align: "center",
            renderCell: ({ allocated }) => (
              <Typography variant="h6">{allocated.maternal}</Typography>
            ),
          },
        ]}
        data={state.allowances || []}
        selectionEnabled
      />
    </div>
  );
};

export default EntitlementsPanel;
