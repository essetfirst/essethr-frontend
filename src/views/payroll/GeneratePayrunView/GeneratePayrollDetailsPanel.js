import React from "react";

import {
  Box,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";

function GeneratePayrollDetailsPanel({ formProps }) {
  const { values, errors, touched, onBlur, onChange } = formProps;
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
            error={touched.title && errors.title}
            helperText={touched.title && errors.title}
            label="Title"
            name="title"
            value={values.title}
            onBlur={onBlur}
            onChange={onChange}
            placeholder="Write something descriptive, e.g August 2020 Payroll"
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <TextField
            fullWidth
            error={touched.from && errors.from}
            helperText={touched.from && errors.from}
            label="From date"
            type="date"
            name="from"
            value={values.from}
            onBlur={onBlur}
            onChange={onChange}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <TextField
            fullWidth
            error={touched.to && errors.to}
            helperText={touched.to && errors.to}
            label="To date"
            type="date"
            name="to"
            value={values.to}
            onBlur={onBlur}
            onChange={onChange}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <TextField
            fullWidth
            error={touched.payDate && errors.payDate}
            helperText={touched.payDate && errors.payDate}
            label="Pay date"
            type="date"
            name="payDate"
            value={values.payDate}
            onBlur={onBlur}
            onChange={onChange}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <TextField
            fullWidth
            error={touched.payType && errors.payType}
            helperText={touched.payType && errors.payType}
            select
            label="Payment type"
            name="payType"
            value={values.payType}
            onBlur={onBlur}
            onChange={onChange}
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
