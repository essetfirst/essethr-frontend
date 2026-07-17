import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, Button } from "@mui/material";

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  children,
}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={6}
      px={2}
      textAlign="center"
    >
      {icon && (
        <Box color="text.secondary" mb={2} fontSize={48}>
          {icon}
        </Box>
      )}
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="textSecondary" style={{ maxWidth: 420 }} gutterBottom>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </Box>
      )}
      {children}
    </Box>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  children: PropTypes.node,
};
