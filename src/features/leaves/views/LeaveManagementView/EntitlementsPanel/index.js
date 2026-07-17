import React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
} from "@mui/material";
import { styled } from "@mui/material/styles";

import API from "api";
import useOrg from "features/org/providers";
import { allocateAllowanceSchema } from "features/org/schemas/formSchemas";
import arrayToMap from "utils/arrayToMap";
import TableComponent from "components/TableComponent";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";

const StyledRoot = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  padding: theme.spacing(3),
    backdropFilter: "blur(3px)",
}));

const AllocateAllowanceDialog = ({
  open,
  onClose,
  employees,
  onSubmit,
  isLoading,
}) => {

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(allocateAllowanceSchema),
    defaultValues: { employeeId: -1 },
  });

  const employeeId = watch("employeeId");

  React.useEffect(() => {
    if (!open) reset({ employeeId: -1 });
  }, [open, reset]);

  const onFormSubmit = async (values) => {
    await onSubmit(values);
    reset({ employeeId: -1 });
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
     
    >
      <DialogContent>
        <Box p={2}>
          <Typography variant="h3" align="center" sx={{ fontFamily: "Poppins" }}>
            Allocate Allowance
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item sm={12} lg={12}>
                <TextField
                  fullWidth
                  select
                  error={Boolean(errors.employeeId)}
                  helperText={errors.employeeId?.message}
                  label="Employee"
                  {...register("employeeId")}
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
                    type="submit"
                    disabled={employeeId === -1 || isLoading}
                    sx={{ mb: 2 }}
                  >
                    {isLoading ? "Allocating..." : "Allocate"}
                  </Button>
                  <Button fullWidth variant="outlined" type="button" onClick={onClose}>
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </form>
      </DialogContent>
    </StyledDialog>
  );
};

const EntitlementsPanel = ({
  state,
  notify,
  onFetchAllowances,
  requesting,
}) => {
  const { org } = useOrg();
  const [isLoading, setIsLoading] = React.useState(false);

  const employeesMap = arrayToMap(org.employees || [], "_id");

  const [allocateDialogOpen, setAllocateDialogOpen] = React.useState(false);
  const handleAllocateDialogClose = () => setAllocateDialogOpen(false);
  const handleAllocateClick = () => {
    setAllocateDialogOpen(true);
  };
  const handleAllocateAllowance = async (allowanceInfo) => {
    const { employeeId } = allowanceInfo;

    setIsLoading(true);
    try {
      const { success, error } = await API.leaves.allowances.allocate({
        employeeId,
      });
      if (success) {
        notify({
          message: "Allowance allocated successfully",
          variant: "success",
        });
        setIsLoading(false);
        onFetchAllowances();
      }
      if (error) {
        notify({ message: error, variant: "error" });
        setIsLoading(false);
      }
    } catch (err) {
      notify({ message: err.message, variant: "error" });
      setIsLoading(false);
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
        isLoading={isLoading}
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
        requestState={{ requesting }}
      />
    </div>
  );
};

export default EntitlementsPanel;
