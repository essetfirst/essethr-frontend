import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import API from "../../../../api";
import useOrg from "../../../../providers/org";
import arrayToMap from "../../../../utils/arrayToMap";
import TableComponent from "../../../../components/TableComponent";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import { Delete as DeleteIcon } from "react-feather";
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";

const AllocateAllowanceDialog = ({
  open,
  onClose,
  employees,
  leaveTypes,
  onSubmit,
  onDeleteLeaveBalanceClicked,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Box p={2}>
          <Typography variant="h3" align="center" gutterBottom>
            Allocate leave balance
          </Typography>
          <Divider />
        </Box>

        <Formik
          initialValues={{
            employeeId: -1,
            leaveType: -1,
            days: 0,
          }}
          validationSchema={Yup.object().shape({
            employeeId: Yup.string()
              .required("'Employee id' is required")
              .notOneOf([-1], "'Employee id' is required"),
            leaveType: Yup.string()
              .required("'Leave type' is required")
              .notOneOf([-1], "'Employee id' is required"),
            days: Yup.number().positive(
              "'Balance in days' can not be negative"
            ),
          })}
          onSubmit={onSubmit}
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
                    <Grid item sm={12} lg={6}>
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
                    <Grid item sm={12} lg={6}>
                      <TextField
                        fullWidth
                        select
                        error={Boolean(touched.leaveType && errors.leaveType)}
                        helperText={touched.leaveType && errors.leaveType}
                        label="leave Type"
                        name="leaveType"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.leaveType}
                        variant="outlined"
                      >
                        <MenuItem value={-1}>Choose leave type</MenuItem>
                        {leaveTypes.map(({ name }) => (
                          <MenuItem value={name} key={name}>
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
                          disabled={
                            values.employeeId === -1 || values.leaveType === -1
                          }
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

const EntitlementsPanel = ({
  state,
  notify,
  onFetchAllowances,
  onDeleteLeaveBalanceClicked,
}) => {
  const { org } = useOrg();

  console.log("[EntitlementsPanel]: Line 185 -> state: ", org);

  const employeesMap = arrayToMap(org.employees || [], "_id");

  const [allocateDialogOpen, setAllocateDialogOpen] = React.useState(false);
  const handleAllocateDialogClose = () => setAllocateDialogOpen(false);

  const handleAllocateClick = () => {
    setAllocateDialogOpen(true);
  };

  const handleAllocateAllowance = async (allowanceInfo) => {
    console.log("Allowance info: ", allowanceInfo);
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

  React.useEffect(
    () => {
      console.log("Aloowancessssssssss", state);
      onFetchAllowances();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const employees = Object.values(employeesMap).map(
    ({ _id, firstName, surName, lastName }) => ({
      _id,
      name: `${firstName} ${surName} ${lastName}`,
    })
  );

  const leaveTypes = [
    { name: "Annual", key: "annual", duration: 16 },
    { name: "Special", key: "special", duration: 3 },
    { name: "Maternal", key: "maternal", duration: 30 },
  ];

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
            startIcon={<AddCircleRoundedIcon size="16px" />}
          >
            Allocate Balance
          </Button>
        </ButtonGroup>
      </Box>
      <AllocateAllowanceDialog
        open={allocateDialogOpen}
        onClose={handleAllocateDialogClose}
        employees={employees}
        leaveTypes={leaveTypes}
        onSubmit={handleAllocateAllowance}
      />

      {/* Summary usage and leave by type */}
      <TableComponent
        size="small"
        columns={[
          {
            label: "Employee",
            field: "employeeId",
            renderCell: ({ employeeId }) => {
              const { firstName, surName } = employeesMap[employeeId] || {};
              const name = `${firstName} ${surName}`;
              return <Typography variant="h6">{name}</Typography>;
            },
          },

          {
            label: "Annual leave",
            field: "annual",
            align: "center",
            renderCell: ({ allocated }) => allocated.annual,
          },
          {
            label: "Special leave",
            field: "special",
            align: "center",
            renderCell: ({ allocated }) => allocated.special,
          },
          {
            label: "Maternity leave",
            field: "maternal",
            align: "center",
            renderCell: ({ allocated }) => allocated.maternal,
          },
          {
            label: "Allocated",
            align: "center",
            renderCell: ({ allocatedTotal }) => allocatedTotal,
          },
          {
            label: "Remaining",
            align: "center",
            renderCell: ({ allocatedTotal, usedTotal }) =>
              allocatedTotal - usedTotal,
          },
        ]}
        data={state.allowances}
        selectionEnabled
        rowActions={[
          // {
          //   label: "Edit Leave",
          //   icon: <EditIcon />,
          //   handler: ({ _id }) => onEditLeaveClicked(_id),
          // },
          {
            label: "Delete Leave",
            icon: <DeleteIcon />,
            handler: ({ _id }) => onDeleteLeaveBalanceClicked(_id),
          },
        ]}
      />
    </div>
  );
};

export default EntitlementsPanel;
