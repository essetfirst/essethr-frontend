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
import { Grid as GridIcon, List as ListIcon } from "react-feather";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import { Search as SearchIcon, Filter as FilterIcon } from "react-feather";

import FilterBar from "./FilterBar";

const Toolbar = ({
  viewType,
  onViewTypeChange,
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
        <Box display="flex" alignItems="center" justifyContent="space-between">
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
          <Box display="flex" justifyContent="flex-end" mt={1}>
            <ToggleButtonGroup value={viewType}>
              <ToggleButton
                value="list"
                size="small"
                onClick={onViewTypeChange}
              >
                <ListIcon
                  fontSize="small"
                  size="16"
                  style={{ marginRight: "5px" }}
                />
                <span>List</span>
              </ToggleButton>
              <ToggleButton
                value="grid"
                size="small"
                onClick={onViewTypeChange}
              >
                <GridIcon
                  fontSize="small"
                  size="16"
                  style={{ marginRight: "5px" }}
                />
                <span>Grid</span>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <Collapse in={filterOpen} unmountOnExit>
          <Box mt={2}>
            <Divider />
            <FilterBar
              filters={filters}
              departmentOptions={[
                ...departments.map((d) => ({
                  label: d.name,
                  value: d._id,
                })),
              ]}
              positionOptions={[
                ...positions.map((p) => ({
                  label: p.title,
                  value: p._id,
                })),
              ]}
              genderOptions={[
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
