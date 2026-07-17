import React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
} from "@mui/material";

import API from "api";
import useBranches from "features/org/hooks/useBranches";
import { branchTransferSchema } from "features/employees/schemas/branchTransferSchema";

const selectMenuProps = {
  disablePortal: true,
  PaperProps: { sx: { maxHeight: 280 } },
};

const BranchTransferDialog = ({ open, onClose, employee, onTransfer }) => {
  const { branches, branchLabel, loading, fetchBranches } = useBranches();
  const [destDepartments, setDestDepartments] = React.useState([]);
  const [destPositions, setDestPositions] = React.useState([]);
  const [listsLoading, setListsLoading] = React.useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(branchTransferSchema),
    defaultValues: {
      destinationOrg: "",
      destinationDepartment: "",
      destinationPosition: "",
    },
  });

  const values = watch();

  React.useEffect(() => {
    if (open) {
      fetchBranches();
    } else {
      reset({
        destinationOrg: "",
        destinationDepartment: "",
        destinationPosition: "",
      });
      setDestDepartments([]);
      setDestPositions([]);
    }
  }, [open, reset, fetchBranches]);

  React.useEffect(() => {
    if (!open || !values.destinationOrg) {
      setDestDepartments([]);
      setDestPositions([]);
      return;
    }

    let cancelled = false;
    setListsLoading(true);

    Promise.all([
      API.orgs.departments.get(values.destinationOrg),
      API.orgs.positions.get(values.destinationOrg),
    ])
      .then(([dRes, pRes]) => {
        if (cancelled) return;
        setDestDepartments(Array.isArray(dRes?.departments) ? dRes.departments : []);
        setDestPositions(Array.isArray(pRes?.positions) ? pRes.positions : []);
      })
      .catch(() => {
        if (!cancelled) {
          setDestDepartments([]);
          setDestPositions([]);
        }
      })
      .finally(() => {
        if (!cancelled) setListsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, values.destinationOrg]);

  if (!employee) return null;

  const currentBranchLabel = branchLabel(employee.org);
  const destinationBranches = branches.filter((b) => String(b._id) !== String(employee.org));

  const onSubmit = (formValues) => {
    onTransfer({
      _id: employee._id,
      org: formValues.destinationOrg,
      department: formValues.destinationDepartment,
      position: formValues.destinationPosition,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      disableScrollLock
      slotProps={{ paper: { sx: { overflow: "visible" } } }}
    >
      <DialogContent>
        <Typography variant="h5" align="center" gutterBottom>
          Transfer to another branch
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" gutterBottom>
          Moves the employee to a different branch with a new department and position.
        </Typography>
        <Divider />
        <Box mt={2} mb={1} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item sm={12} md={6}>
              <TextField
                fullWidth
                label="Employee"
                value={
                  employee.name ||
                  `${employee.firstName || ""} ${employee.surName || ""}`.trim()
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
                value={currentBranchLabel}
                variant="outlined"
                size="small"
                disabled
              />
            </Grid>

            <Grid item sm={12} md={4}>
              <TextField
                fullWidth
                select
                disabled={loading}
                error={Boolean(errors.destinationOrg)}
                helperText={
                  errors.destinationOrg?.message ||
                  (destinationBranches.length === 0 && !loading
                    ? "No other branches available"
                    : "")
                }
                label="Destination branch"
                name="destinationOrg"
                onChange={(e) => {
                  setValue("destinationOrg", e.target.value, { shouldValidate: true });
                  setValue("destinationDepartment", "");
                  setValue("destinationPosition", "");
                }}
                value={values.destinationOrg}
                variant="outlined"
                size="small"
                SelectProps={{ MenuProps: selectMenuProps }}
              >
                <MenuItem value="">Choose branch</MenuItem>
                {destinationBranches.map(({ _id, branch, name }) => (
                  <MenuItem value={String(_id)} key={String(_id)}>
                    {branch || name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item sm={12} md={4}>
              <TextField
                fullWidth
                select
                disabled={!values.destinationOrg || listsLoading}
                error={Boolean(errors.destinationDepartment)}
                helperText={errors.destinationDepartment?.message}
                label="Destination department"
                name="destinationDepartment"
                onChange={(e) => {
                  setValue("destinationDepartment", e.target.value, { shouldValidate: true });
                  setValue("destinationPosition", "");
                }}
                value={values.destinationDepartment}
                variant="outlined"
                size="small"
                SelectProps={{ MenuProps: selectMenuProps }}
              >
                <MenuItem value="">Choose department</MenuItem>
                {destDepartments.map((dept) => (
                  <MenuItem value={String(dept._id)} key={String(dept._id)}>
                    {dept.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item sm={12} md={4}>
              <TextField
                fullWidth
                select
                disabled={!values.destinationDepartment || listsLoading}
                error={Boolean(errors.destinationPosition)}
                helperText={errors.destinationPosition?.message}
                label="Destination position"
                name="destinationPosition"
                onChange={(e) =>
                  setValue("destinationPosition", e.target.value, { shouldValidate: true })
                }
                value={values.destinationPosition}
                variant="outlined"
                size="small"
                SelectProps={{ MenuProps: selectMenuProps }}
              >
                <MenuItem value="">Choose position</MenuItem>
                {destPositions
                  .filter(
                    (pos) =>
                      String(pos.department) === String(values.destinationDepartment),
                  )
                  .map((pos) => (
                    <MenuItem value={String(pos._id)} key={String(pos._id)}>
                      {pos.title}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
          </Grid>
          <Box mt={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading || listsLoading || destinationBranches.length === 0}
            >
              Transfer employee
            </Button>
            <Box mt={1} />
            <Button fullWidth variant="outlined" onClick={onClose} type="button">
              Cancel
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

BranchTransferDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  employee: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    firstName: PropTypes.string,
    surName: PropTypes.string,
    org: PropTypes.string,
  }),
  onTransfer: PropTypes.func.isRequired,
};

export default BranchTransferDialog;
