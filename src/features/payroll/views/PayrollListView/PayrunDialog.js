import React from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

const employeeSelectChoices = [
  { value: "all", label: "All" },
  { value: "department", label: "By department" },
  { value: "custom", label: "Custom" },
];

const periodSelectChoices = [
  { value: "last_week", label: "Last Week" },
  { value: "current_week", label: "Current Week" },
  { value: "last_month", label: "Last Month" },
  { value: "current_month", label: "Current Month" },
  { value: "custom", label: "Custom" },
];

import { payrunDialogSchema } from "features/payroll/schemas/payrunDialogSchema";

const PayrunDialog = ({ open, onClose, onSubmit }) => {
  const [isCustomPeriod, setIsCustomPeriod] = React.useState(false);
  const [isByDept, setIsByDept] = React.useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(payrunDialogSchema),
    defaultValues: {
      employeeSelect: "",
      department: "",
      period: "",
      from: null,
      to: null,
    },
  });

  const values = watch();

  const handleEmployeeSelect = (value) => {
    if (value === "all") {
      setIsByDept(false);
    } else if (value === "department") {
      setIsByDept(true);
    }
    setValue("employeeSelect", value, { shouldValidate: true });
  };

  const handlePeriodSelect = (value) => {
    if (value === "current_month" || value === "current_week") {
      setIsCustomPeriod(false);
    } else {
      setIsCustomPeriod(true);
    }
    setValue("period", value, { shouldValidate: true });
  };

  const submitForm = (formValues) => {
    onSubmit?.(formValues);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Payroll Process</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(submitForm)}>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <FormControl
                error={Boolean(errors.employeeSelect)}
                fullWidth
                variant="outlined"
                margin="normal"
              >
                <InputLabel shrink htmlFor="employeeSelect">
                  Employees
                </InputLabel>
                <Select
                  id="employeeSelect"
                  label="Selected Employees"
                  value={values.employeeSelect || ""}
                  onChange={(e) => handleEmployeeSelect(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {employeeSelectChoices.map(({ label, value }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.employeeSelect?.message}</FormHelperText>
              </FormControl>
            </Grid>
            {isByDept && (
              <Grid item md={6}>
                <FormControl
                error={Boolean(errors.department)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                >
                  <InputLabel shrink htmlFor="departmentSelect">
                    Department
                  </InputLabel>
                  <Select
                    id="departmentSelect"
                    label="Department"
                    value={values.department || ""}
                    onChange={(e) =>
                      setValue("department", e.target.value, { shouldValidate: true })
                    }
                  >
                    <MenuItem value="">Choose</MenuItem>
                  </Select>
                  <FormHelperText>{errors.department?.message}</FormHelperText>
                </FormControl>
              </Grid>
            )}
            <Grid item>
              <FormControl
                error={Boolean(errors.period)}
                fullWidth
                variant="outlined"
                margin="normal"
              >
                <InputLabel shrink htmlFor="periodSelect">
                  Period
                </InputLabel>
                <Select
                  id="periodSelect"
                  label="Period"
                  value={values.period || ""}
                  onChange={(e) => handlePeriodSelect(e.target.value)}
                >
                  <MenuItem value="">Choose</MenuItem>
                  {periodSelectChoices.map(({ label, value }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.period?.message}</FormHelperText>
              </FormControl>
            </Grid>
            {isCustomPeriod && (
              <>
                <Grid item md={6}>
                  <Controller
                    name="from"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="From"
                        value={field.value}
                        onChange={field.onChange}
                        slotProps={{
                          textField: {
                            error: Boolean(errors.from),
                            fullWidth: true,
                            helperText: errors.from?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={6}>
                  <Controller
                    name="to"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="To"
                        value={field.value}
                        onChange={field.onChange}
                        slotProps={{
                          textField: {
                            error: Boolean(errors.to),
                            fullWidth: true,
                            helperText: errors.to?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="cancel">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit(submitForm)} aria-label="submit">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PayrunDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default PayrunDialog;
