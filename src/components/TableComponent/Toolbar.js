import React from "react";
import { Box, Button, IconButton, Toolbar as MuiToolbar, Typography, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButtonSpacing = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1),
}));

const StyledIconButtonSpacing = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(0, 1),
}));

const StyledToolbar = styled(MuiToolbar)(({ theme }) => ({
  flex: 1,
  alignItems: "center",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1),
  minHeight: 48,
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === "light" ? 0.06 : 0.12),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledToolbarTitle = styled(Typography)({
  flex: "1 1 100%",
  fontWeight: 600,
});

const Toolbar = ({
  maxCount,
  selected,
  toolbarSelectionTitle = "Selected",
  toolbarActions,
}) => {
  const selectedCount = selected.length;
  if (selectedCount < 1) {
    return null;
  }

  return (
    <StyledToolbar>
      <StyledToolbarTitle color="inherit" variant="subtitle2" component="div">
        {selectedCount === maxCount ? "All" : selectedCount} {toolbarSelectionTitle}
      </StyledToolbarTitle>

      {selectedCount > 1 && (
        <Box width="100%" display="flex" alignItems="center" justifyContent="flex-end">
          {toolbarActions.map(({ type, label, icon, handler, ...rest }, index) =>
            type === "icon" ? (
              <StyledIconButtonSpacing
                key={index}
                onClick={handler(selected)}
                aria-label={label}
                {...rest}
              >
                {icon}
              </StyledIconButtonSpacing>
            ) : (
              <StyledButtonSpacing
                key={index}
                onClick={handler(selected)}
                startIcon={icon}
                aria-label={label}
                variant="outlined"
                size="small"
                {...rest}
              >
                {label}
              </StyledButtonSpacing>
            ),
          )}
        </Box>
      )}
    </StyledToolbar>
  );
};

export default Toolbar;
