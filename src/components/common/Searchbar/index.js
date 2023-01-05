import React from "react";
import PropTypes from "prop-types";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import {
  FilterList as FilterIcon,
  Search as SearchIcon,
} from "@material-ui/icons";

const Searchbar = ({
  searchTerm,
  searchTermPlaceholder = "Search",
  onSearchTermChange,
  searchbarElements,
  hasFilterbar,
  filterbarElements,
}) => {
  const [showFilterbar, setShowFilterbar] = React.useState(false);

  const toggleFilterbar = () => setShowFilterbar(!showFilterbar);

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center">
          <Box display="flex" alignItems="center" mr={1} width={250}>
            <TextField
              fullWidth
              label="Search"
              name="searchTerm"
              value={searchTerm}
              onChange={onSearchTermChange(searchTerm)}
              placeholder={searchTermPlaceholder}
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
          {hasFilterbar && (
            <Box display="flex" alignItems="center" mr="auto">
              <Button
                variant={showFilterbar ? "contained" : "outlined"}
                color={showFilterbar ? "primary" : "inherit"}
                onClick={toggleFilterbar}
                aria-label="filter search"
                startIcon={<FilterIcon fontSize="small" size="18" />}
              >
                Filter
              </Button>
            </Box>
          )}
          <Box display="flex" justifyContent="flex-end">
            {searchbarElements}
          </Box>
        </Box>
        {hasFilterbar && filterbarElements && showFilterbar && (
          <Box>
            <Divider />
            {filterbarElements}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

Searchbar.propTypes = {
  /**
   * Value of search input
   */
  searchTerm: PropTypes.string,
  /**
   * Placeholder text for search input
   */
  searchTermPlaceholder: PropTypes.string,
  /**
   * Handler for search input value change
   */
  onSearchTermChange: PropTypes.func,
  /**
   * Elements displayed alongside search input
   */
  searchbarElements: PropTypes.node,
  /**
   * Wheather filter bar is included
   */
  hasFilterbar: PropTypes.bool,
  /**
   * Filter elements displayed below search bar
   */
  filterbarElements: PropTypes.node,
};

export default Searchbar;
