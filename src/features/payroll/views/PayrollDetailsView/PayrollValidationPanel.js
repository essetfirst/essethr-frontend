import React from "react";
import PropTypes from "prop-types";
import {
  Box, Paper, Typography, Button, Chip, List, ListItem, ListItemText,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { payrollApiExt } from "features/platform/api";

export default function PayrollValidationPanel({ payrollId, onValidated }) {
  const [validation, setValidation] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const runValidation = async () => {
    setLoading(true);
    try {
      const res = await payrollApiExt.validate(payrollId);
      setValidation(res?.validation || null);
      onValidated?.(res?.validation);
    } catch {
      setValidation(null);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (payrollId) runValidation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payrollId]);

  if (!validation && !loading) return null;

  return (
    <Paper variant="outlined" style={{ padding: 16, marginBottom: 16 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle1">Payroll validation</Typography>
        <Button size="small" onClick={runValidation} disabled={loading}>
          {loading ? "Validating…" : "Re-validate"}
        </Button>
      </Box>

      {validation && (
        <>
          <Box display="flex" alignItems="center" gridGap={8} mb={1}>
            {validation.valid ? (
              <Chip icon={<CheckCircleIcon />} label="Ready for lock/finalize" color="primary" size="small" />
            ) : (
              <Chip icon={<WarningIcon />} label="Issues found" color="secondary" size="small" />
            )}
            <Chip label={`Status: ${validation.status || "draft"}`} size="small" variant="outlined" />
            <Chip label={`${validation.payslipCount || 0} payslips`} size="small" variant="outlined" />
          </Box>

          {validation.errors?.length > 0 && (
            <List dense>
              {validation.errors.map((err) => (
                <ListItem key={err.code}>
                  <ListItemText
                    primary={err.message}
                    secondary={err.code}
                    primaryTypographyProps={{ color: "error" }}
                  />
                </ListItem>
              ))}
            </List>
          )}

          {validation.warnings?.length > 0 && (
            <List dense>
              {validation.warnings.map((w) => (
                <ListItem key={w.code}>
                  <ListItemText primary={w.message} secondary={w.code} />
                </ListItem>
              ))}
            </List>
          )}
        </>
      )}
    </Paper>
  );
}

PayrollValidationPanel.propTypes = {
  payrollId: PropTypes.string.isRequired,
  onValidated: PropTypes.func,
};
