import React from "react";

import {
  Box,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

function GeneratePayrollDetailsPanel({ register, errors }) {
  return (
    <Box height="100%" justifyContent="center">
      <Typography variant="h3" align="center" gutterBottom>
        Payroll details
      </Typography>
      <Divider />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <TextField
            fullWidth
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
            label="Title"
            {...register("title")}
            placeholder="Write something descriptive, e.g August 2020 Payroll"
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <TextField
            fullWidth
            error={Boolean(errors.from)}
            helperText={errors.from?.message}
            label="From date"
            type="date"
            {...register("from")}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <TextField
            fullWidth
            error={Boolean(errors.to)}
            helperText={errors.to?.message}
            label="To date"
            type="date"
            {...register("to")}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <TextField
            fullWidth
            error={Boolean(errors.payDate)}
            helperText={errors.payDate?.message}
            label="Pay date"
            type="date"
            {...register("payDate")}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <TextField
            fullWidth
            error={Boolean(errors.payType)}
            helperText={errors.payType?.message}
            select
            label="Payment type"
            {...register("payType")}
            margin="normal"
            variant="outlined"
          >
            <MenuItem value={"daily"}>Daily</MenuItem>
            <MenuItem value={"hourly"}>Hourly</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GeneratePayrollDetailsPanel;
