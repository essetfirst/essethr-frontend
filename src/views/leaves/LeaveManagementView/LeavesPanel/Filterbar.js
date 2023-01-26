import React from "react";
import PropTypes from "prop-types";

import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";

import { Search as SearchIcon, Filter as FilterIcon } from "react-feather";

const FilterBar = ({
  filters,
  onFilterChange,
  onReset,
  departmentOptions,
  leaveTypeOptions,
  statusOptions,
}) => {
  // const [filters, setFilters] = React.useState({ name: "" });

  const [filterBarOpen, setFilterBarOpen] = React.useState(false);
  const toggleFilterBar = () => setFilterBarOpen(!filterBarOpen);

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Box display="flex" alignItems="center" mr={1} width={250}>
            <TextField
              fullWidth
              name="searchTerm"
              value={filters.searchTerm}
              onChange={onFilterChange("searchTerm")}
              placeholder=" Search leaves"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment>
                    <SearchIcon fontSize="small" size="18" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box display="flex" alignItems="center" mr="auto">
            <Button
              onClick={toggleFilterBar}
              variant={filterBarOpen ? "contained" : "outlined"}
              color={filterBarOpen ? "primary" : "default"}
              startIcon={<FilterIcon />}
            >
              Filter
            </Button>
          </Box>
        </Box>

        <Collapse in={filterBarOpen} mountOnEnter unmountOnExit>
          <Box mt={2}>
            <Divider />
            <Box mt={1} />
            <Typography variant="h6" gutterBottom>
              Filter by
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4}>
                <TextField
                  fullWidth
                  select
                  label="Department"
                  name="department"
                  value={filters.department}
                  onChange={onFilterChange}
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
              <Grid item xs={12} sm={12} md={6} lg={4}>
                <TextField
                  fullWidth
                  select
                  label="Leave Type"
                  name="leaveType"
                  value={filters.leaveType}
                  onChange={onFilterChange}
                  variant="outlined"
                  margin="dense"
                  size="small"
                >
                  {leaveTypeOptions.map(({ label, value }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  name="status"
                  value={filters.status}
                  onChange={onFilterChange}
                  variant="outlined"
                  margin="dense"
                  size="small"
                >
                  {statusOptions.map(({ label, value }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={8}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Start date"
                      name="fromDate"
                      type="date"
                      value={new Date(filters.fromDate || null)
                        .toISOString()
                        .slice(0, 10)}
                      onChange={onFilterChange}
                      variant="outlined"
                      margin="dense"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="End date"
                      name="toDate"
                      type="date"
                      value={new Date(filters.toDate || null)
                        .toISOString()
                        .slice(0, 10)}
                      onChange={onFilterChange}
                      variant="outlined"
                      margin="dense"
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Button variant="contained" onClick={onReset}>
                    Reset
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

FilterBar.propTypes = {
  /**
   * An object containing the filters
   */
  filters: PropTypes.string,
  /**
   * A handler for listening change in filter parameters.
   */
  onFilterChange: PropTypes.func,
  /**
   * A handler for clearing set filters
   */
  onReset: PropTypes.func,
  /**
   * An array containing department filter options
   */
  departmentOptions: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ),
  /**
   * An array containing leave type filter options
   */
  leaveTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ),
  /**
   * An array containing status filter options
   */
  statusOptions: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ),
};

export default FilterBar;
