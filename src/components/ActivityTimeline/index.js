import { fmt } from "utils/date";
import React from "react";
import PropTypes from "prop-types";
import { Box, Paper, Typography, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledRoot = styled("div")(({ theme }) => ({
  position: "relative",
  paddingLeft: theme.spacing(3),
}));

const StyledLine = styled("div")(({ theme }) => ({
  position: "absolute",
  left: 7,
  top: 8,
  bottom: 8,
  width: 2,
  background: theme.palette.divider,
}));

const StyledDot = styled("div")(({ theme }) => ({
  position: "absolute",
  left: 0,
  top: 6,
  width: 16,
  height: 16,
  borderRadius: "50%",
  background: theme.palette.primary.main,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const StyledItem = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  position: "relative",
}));

export default function ActivityTimeline({ items = [], loading }) {
  if (loading) {
    return <Typography color="textSecondary">Loading activity…</Typography>;
  }

  if (!items.length) {
    return (
      <Typography color="textSecondary" variant="body2">
        No activity recorded yet.
      </Typography>
    );
  }

  return (
    <StyledRoot>
      <StyledLine />
      {items.map((item) => (
        <StyledItem key={item._id || item.id}>
          <StyledDot />
          <Paper variant="outlined" style={{ padding: 12 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              flexWrap="wrap"
            >
              <Box>
                <Typography variant="subtitle2">
                  {item.summary || item.action || "Activity"}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  {item.actorEmail || item.actorRole || "System"}
                  {" · "}
                  {fmt(item.createdOn || item.at, "MMM d, yyyy h:mm a")}
                </Typography>
              </Box>
              {item.action && (
                <Chip size="small" label={item.action} variant="outlined" />
              )}
            </Box>
          </Paper>
        </StyledItem>
      ))}
    </StyledRoot>
  );
}

ActivityTimeline.propTypes = {
  items: PropTypes.array,
  loading: PropTypes.bool,
};
