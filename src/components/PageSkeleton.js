import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { Skeleton } from "@mui/lab";

/**
 * Reusable MUI Skeleton loader for page layouts.
 */
const PageSkeleton = ({ showTitle = true, showActions = true, contentRows = 4 }) => {
  return (
    <Box width="100%" aria-busy="true" aria-label="Loading page">
      {showTitle && (
        <Skeleton variant="text" width="40%" height={48} sx={{ mb: 2 }} />
      )}
      {showActions && (
        <Box display="flex" gap={1} mb={3}>
          <Skeleton variant="rect" width={100} height={36} />
          <Skeleton variant="rect" width={100} height={36} />
        </Box>
      )}
      <Box display="flex" flexDirection="column" gap={2}>
        {Array.from({ length: contentRows }).map((_, i) => (
          <Skeleton key={i} variant="rect" height={i === 0 ? 120 : 56} />
        ))}
      </Box>
    </Box>
  );
};

PageSkeleton.propTypes = {
  showTitle: PropTypes.bool,
  showActions: PropTypes.bool,
  contentRows: PropTypes.number,
};

export default PageSkeleton;
