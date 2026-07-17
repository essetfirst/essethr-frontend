import React from "react";
import PropTypes from "prop-types";

import clsx from "clsx";
import { Box, Button, Card, CardContent, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledRoot = styled("div")(() => ({}));

const Toolbar = ({
  className,
  onImportClicked,
  onExportClicked,
  onGenerateClicked,
}) => {
  const [filters, setFilters] = React.useState({
    searchTerm: "",
    month: "",
    year: "",
    fromDate: "",
    toDate: "",
  });

  const handleChange = (filterName) => (e) => {
    setFilters({ ...filters, [filterName]: e.target.value });
  };

  return (
    <StyledRoot className={className}>
      <Box display="flex" justifyContent="flex-end" mt={4} mb={1}>
        <Button aria-label="import" onClick={onImportClicked}>
          import
        </Button>
        <Button aria-label="export" onClick={onExportClicked}>
          export
        </Button>
        <Button
          variant="contained"
          aria-label="process"
          color="primary"
          onClick={onGenerateClicked}
        >
          Generate
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box p={1} maxWidth={500}>
            <TextField
              fullWidth
              id="searchField"
              name="searchText"
              variant="outlined"
              placeholder="Search payroll"
              onChange={handleChange("searchTerm")}
            />
          </Box>
        </CardContent>
      </Card>
    </StyledRoot>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string,
  onImportClicked: PropTypes.func,
  onExportClicked: PropTypes.func,
  onGenerateClicked: PropTypes.func,
};

export default Toolbar;
