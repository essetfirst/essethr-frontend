import React from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  InputAdornment,
  TextField,
} from "@material-ui/core";

import { Search as SearchIcon, Filter as FilterIcon } from "react-feather";

import FilterBar from "./FilterBar";

const Toolbar = ({
  filters,
  onFilterChange,
  onFiltersReset,
  departments = [],
  positions = [],
}) => {
  const [filterOpen, setFilterOpen] = React.useState(false);
  const toggleFilter = () => setFilterOpen(!filterOpen);

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Box display="flex" alignItems="center" mr={1} width={250}>
            <TextField
              fullWidth
              label="Search"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={onFilterChange("searchTerm")}
              placeholder="Search employees"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" size="18" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box display="flex" alignItems="center" mr="auto">
            <Button
              variant={filterOpen ? "contained" : "outlined"}
              color={filterOpen ? "primary" : "inherit"}
              onClick={toggleFilter}
              aria-label="filter search"
              startIcon={<FilterIcon fontSize="small" size="18" />}
            >
              Filter
            </Button>
          </Box>
        </Box>

        <Collapse in={filterOpen} unmountOnExit>
          <Box mt={2}>
            <Divider />
            <FilterBar
              filters={filters}
              departmentOptions={[
                { label: "ALL", value: "ALL" },
                ...departments.map((d) => ({
                  label: d.name,
                  value: d._id,
                })),
              ]}
              positionOptions={[
                { label: "ALL", value: "ALL" },
                ...positions.map((p) => ({
                  label: p.title,
                  value: p._id,
                })),
              ]}
              genderOptions={[
                { label: "ALL", value: "ALL" },
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
              ]}
              onFilterChange={onFilterChange}
              onResetFilters={onFiltersReset}
            />
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default Toolbar;
