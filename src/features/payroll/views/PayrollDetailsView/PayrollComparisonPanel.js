import React from "react";
import PropTypes from "prop-types";
import {
  Box, Paper, Typography, Grid, Chip, CircularProgress,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { payrollApiExt } from "features/platform/api";

export default function PayrollComparisonPanel({ payrollId }) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!payrollId) return;
    setLoading(true);
    payrollApiExt.comparison(payrollId)
      .then((res) => setData(res?.comparison || null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [payrollId]);

  if (loading) {
    return (
      <Paper variant="outlined" style={{ padding: 16, marginBottom: 16 }}>
        <CircularProgress size={24} />
      </Paper>
    );
  }

  if (!data?.previous) {
    return (
      <Paper variant="outlined" style={{ padding: 16, marginBottom: 16 }}>
        <Typography variant="subtitle1" gutterBottom>Period comparison</Typography>
        <Typography variant="body2" color="textSecondary">
          No previous payroll run to compare against.
        </Typography>
      </Paper>
    );
  }

  const { current, previous, delta } = data;
  const DeltaChip = ({ value, pct, label }) => {
    const up = value >= 0;
    return (
      <Box textAlign="center">
        <Typography variant="caption" color="textSecondary">{label}</Typography>
        <Box display="flex" alignItems="center" justifyContent="center" gridGap={4}>
          {up ? <TrendingUpIcon color="primary" fontSize="small" /> : <TrendingDownIcon color="secondary" fontSize="small" />}
          <Typography variant="h6">{up ? "+" : ""}{value}</Typography>
        </Box>
        {pct != null && (
          <Chip size="small" label={`${up ? "+" : ""}${pct}%`} color={up ? "primary" : "secondary"} variant="outlined" />
        )}
      </Box>
    );
  };

  return (
    <Paper variant="outlined" style={{ padding: 16, marginBottom: 16 }}>
      <Typography variant="subtitle1" gutterBottom>Period comparison</Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {current.title} vs {previous.title}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <DeltaChip value={delta.headcount} label="Headcount Δ" />
        </Grid>
        <Grid item xs={4}>
          <DeltaChip value={delta.gross} pct={delta.grossPct} label="Gross pay Δ" />
        </Grid>
        <Grid item xs={4}>
          <DeltaChip value={delta.net} pct={delta.netPct} label="Net pay Δ" />
        </Grid>
      </Grid>
      <Box mt={2} display="flex" gridGap={8}>
        <Chip size="small" label={`Current: ${current.count} payslips`} />
        <Chip size="small" label={`Previous: ${previous.count} payslips`} variant="outlined" />
      </Box>
    </Paper>
  );
}

PayrollComparisonPanel.propTypes = {
  payrollId: PropTypes.string.isRequired,
};
