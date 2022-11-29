import React from "react";
import PropTypes from "prop-types";
import { Box, ButtonGroup, Typography } from "@material-ui/core";

const PageToolbar = ({ title, actionButtons }) => {
  return (
    <div>
      <Typography variant="h2">{title}</Typography>
      <Box>
        <ButtonGroup></ButtonGroup>

        <ButtonGroup></ButtonGroup>
      </Box>
    </div>
  );
};

PageToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  actionButtons: PropTypes.arrayOf(
    PropTypes.shape({
      buttonType: PropTypes.oneOf(["button", "icon-button", "link"]),
      label: PropTypes.string,
      icon: PropTypes.node,
      onClick: PropTypes.func,
      MuiButtonProps: PropTypes.object,
    })
  ),
  align: PropTypes.oneOf(["left", "right"]),
};

export default PageToolbar;
