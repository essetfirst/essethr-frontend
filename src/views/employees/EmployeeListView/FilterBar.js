import React from "react";

import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";

const FilterBar = ({
  filters,
  departmentOptions,
  positionOptions,
  genderOptions,
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <Box mt={1}>
      <Typography variant="h6" gutterBottom>
        Filter by
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Department"
            name="department"
            value={filters.department}
            onChange={onFilterChange("department")}
            select
            variant="outlined"
            margin="dense"
            size="small"
          >
            {departmentOptions.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            select
            label="Position"
            name="position"
            value={filters.position}
            onChange={onFilterChange("position")}
            variant="outlined"
            margin="dense"
            size="small"
          >
            {positionOptions.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            select
            label="Gender"
            name="gender"
            value={filters.gender}
            onChange={onFilterChange("gender")}
            variant="outlined"
            margin="dense"
            size="small"
          >
            {genderOptions.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {/* <Grid item xs={6}>
          <Typography>Age group</Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label="Min age"
                type="number"
                name="minAge"
                value={filters.minAge}
                min={0}
                onChange={onFilterChange("minAge")}
                variant="outlined"
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max age"
                type="number"
                name="maxAge"
                value={filters.maxAge}
                min={0}
                onChange={onFilterChange("maxAge")}
                variant="outlined"
                margin="dense"
                size="small"
              />
            </Grid>
          </Grid>
        </Grid> */}
        {/* <Grid item xs={6}>
          <Typography>Salary range</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Min salary range"
                type="number"
                name="minSalary"
                value={filters.minSalary}
                min={0}
                onChange={onFilterChange("minSalary")}
                variant="outlined"
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Max salary range"
                type="number"
                name="maxSalary"
                value={filters.maxSalary}
                min={0}
                onChange={onFilterChange("maxSalary")}
                variant="outlined"
                margin="dense"
                size="small"
              />
            </Grid>
          </Grid>
        </Grid>{" "}
        label="Department" name="department" value={filters.department}
        onChange={onFilterChange("department")} */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={onResetFilters}>
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterBar;
