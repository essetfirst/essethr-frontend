import React from "react";
import PropTypes from "prop-types";
import {
  Box, Button, MenuItem, Paper, TextField, Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import API from "api";

const ADJUSTMENT_TYPES = [
  { value: "bonus", label: "Bonus" },
  { value: "deduction", label: "Deduction" },
];

const PayrollAdjustmentsPanel = ({ payrollId, employeeId, onSuccess }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = React.useState({
    type: "bonus",
    amount: "",
    label: "",
    employeeId: employeeId || "",
  });
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (employeeId) setForm((f) => ({ ...f, employeeId }));
  }, [employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employeeId?.trim() || !form.amount || Number(form.amount) <= 0) {
      enqueueSnackbar("Employee ID and a positive amount are required.", { variant: "warning" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await API.payroll.addAdjustment(payrollId, {
        type: form.type,
        amount: Number(form.amount),
        label: form.label?.trim() || "",
        employeeId: form.employeeId.trim(),
      });
      if (res?.success) {
        enqueueSnackbar("Adjustment added.", { variant: "success" });
        setForm((f) => ({ ...f, amount: "", label: "" }));
        onSuccess?.();
      } else {
        enqueueSnackbar(res?.error || "Failed to add adjustment.", { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar("Failed to add adjustment.", { variant: "error" });
    }
    setSubmitting(false);
  };

  return (
    <Paper style={{ padding: 16, marginTop: 16 }} variant="outlined">
      <Typography variant="h6" gutterBottom>
        Payroll adjustments
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Add a one-off bonus or deduction for an employee on this payroll run.
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexWrap="wrap"
        gridGap={12}
        alignItems="flex-end"
      >
        <TextField
          label="Employee ID"
          size="small"
          required
          value={form.employeeId}
          onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
          style={{ minWidth: 160 }}
        />
        <TextField
          select
          label="Type"
          size="small"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          style={{ minWidth: 130 }}
        >
          {ADJUSTMENT_TYPES.map((t) => (
            <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Amount"
          size="small"
          type="number"
          required
          inputProps={{ min: 0, step: "0.01" }}
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          style={{ minWidth: 120 }}
        />
        <TextField
          label="Label / reason"
          size="small"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          style={{ minWidth: 200, flex: 1 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={submitting}
        >
          Add adjustment
        </Button>
      </Box>
    </Paper>
  );
};

PayrollAdjustmentsPanel.propTypes = {
  payrollId: PropTypes.string.isRequired,
  employeeId: PropTypes.string,
  onSuccess: PropTypes.func,
};

export default PayrollAdjustmentsPanel;
