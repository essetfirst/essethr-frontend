import React from "react";

import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Typography,
} from "@material-ui/core";

import VerticalTableComponent from "../../../components/VerticalTableComponent";

function SubmitPanel({ values, onSubmit, submitButtonLabel }) {
  return (
    <Box
      height="100%"
      display="flex"
      p={2}
      flexDirection="column"
      justifyContent="center"
    >
      <Typography variant="h3" align="center" gutterBottom>
        Generate payroll
      </Typography>
      <Divider />

      <Box flexGrow={1} m={2} />
      <VerticalTableComponent data={[values]} />
      <Box flexGrow={1} m={2} />

      <Box display="flex" flexDirection="column" justifyContent="space-between">
        <Button
          fullWidth
          onClick={onSubmit}
          color="primary"
          variant="contained"
          aria-label="generate"
          style={{ "margin-bottom": "10px" }}
        >
          {submitButtonLabel || "Submit"}
        </Button>
        <Button fullWidth variant="outlined" aria-label="cancel">
          {"Cancel"}
        </Button>
      </Box>
    </Box>
  );
}

export default SubmitPanel;
