import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
} from "@mui/material";

import useOrg from "features/org/providers";
import { generateReportSchema } from "features/org/schemas/formSchemas";

const getRange = (start, end) => {
  const range = [];
  let i = start;
  while (i <= end) {
    range.push(i);
    i++;
  }
  return range;
};

const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "November",
  "December",
];
const yearOptions = getRange(2010, new Date().getFullYear()).sort((a, b) => b - a);

const getDaysRangeOfMonth = (month, year) => {
  const fromDate = new Date(year, month, 1);
  const toDate = new Date(year, month + 1, 0);
  return { fromDate, toDate };
};

const reportTypeOptions = [
  { label: "Employee", value: "employees" },
  { label: "Attendance", value: "attendance" },
  { label: "Leave", value: "leaves" },
  { label: "Payroll", value: "payroll" },
];

const GenerateForm = ({
  generateFilters,
  departmentOptions,
  onGenerate,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(generateReportSchema),
    defaultValues: {
      dateRange: "lastMonth",
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      ...generateFilters,
    },
  });

  const dateRange = watch("dateRange");

  const onSubmit = (values) => {
    const { reportType, department, dateRange: range, fromDate, toDate, month, year } =
      values;
    let generateFiltersFromForm = { reportType, department, fromDate, toDate };
    if (range === "chooseMonth") {
      generateFiltersFromForm = {
        ...generateFiltersFromForm,
        ...getDaysRangeOfMonth(month, year),
      };
    }
    onGenerate(generateFiltersFromForm);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            error={Boolean(errors.reportType)}
            helperText={errors.reportType?.message}
            label="Report type"
            {...register("reportType")}
            variant="outlined"
            margin="dense"
            size="small"
          >
            {reportTypeOptions.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            error={Boolean(errors.department)}
            helperText={errors.department?.message}
            label="Department"
            {...register("department")}
            variant="outlined"
            margin="dense"
            size="small"
          >
            {[{ label: "ALL", value: "ALL" }, ...departmentOptions].map(
              ({ label, value }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ),
            )}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            error={Boolean(errors.dateRange)}
            helperText={errors.dateRange?.message}
            {...register("dateRange")}
            variant="outlined"
            margin="dense"
            size="small"
          >
            <MenuItem value="lastMonth">Last 28 days</MenuItem>
            <MenuItem value="chooseMonth">Choose month</MenuItem>
            <MenuItem value="chooseDates">Specify custom period</MenuItem>
          </TextField>
        </Grid>
        {dateRange === "chooseDates" ? (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                error={Boolean(errors.fromDate)}
                helperText={errors.fromDate?.message}
                label="From"
                type="date"
                {...register("fromDate")}
                variant="outlined"
                margin="dense"
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                error={Boolean(errors.toDate)}
                helperText={errors.toDate?.message}
                label="To"
                type="date"
                {...register("toDate")}
                variant="outlined"
                margin="dense"
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </>
        ) : dateRange === "chooseMonth" ? (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                error={Boolean(errors.month)}
                helperText={errors.month?.message}
                label="Month"
                {...register("month")}
                variant="outlined"
                margin="dense"
                size="small"
              >
                {monthOptions.map((month, index) => (
                  <MenuItem key={month} value={index}>
                    {month}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                error={Boolean(errors.year)}
                helperText={errors.year?.message}
                label="Year"
                {...register("year")}
                variant="outlined"
                margin="dense"
                size="small"
              >
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </>
        ) : null}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <ButtonGroup>
              <Button variant="outlined" onClick={onCancel} type="button" aria-label="cancel">
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit" aria-label="generate report">
                Generate Report
              </Button>
            </ButtonGroup>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

const GenerateReportDialog = ({ generateFilters, open, onClose, onGenerate }) => {
  const { org } = useOrg();
  const departmentOptions = (org.departments || []).map(({ _id, name }) => ({
    label: name,
    value: _id,
  }));

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="h3" align="center">
          Generate Report
        </Typography>
        <Box p={2}>
          <Divider />
          <Box mt={2} />
          <GenerateForm
            generateFilters={generateFilters}
            departmentOptions={departmentOptions}
            onGenerate={(filters) => {
              onGenerate(filters);
              onClose();
            }}
            onCancel={onClose}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReportDialog;
