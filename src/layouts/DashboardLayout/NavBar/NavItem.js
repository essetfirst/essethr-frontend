import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { ListItem, Typography, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledItem = styled(ListItem)({
  display: "flex",
  paddingTop: 2,
  paddingBottom: 2,
});

const StyledButton = styled(NavLink)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  justifyContent: "flex-start",
  letterSpacing: 0,
  padding: "10px 12px",
  textTransform: "none",
  width: "100%",
  border: "none",
  background: "none",
  cursor: "pointer",
  textDecoration: "none",
  alignItems: "center",
  display: "flex",
  borderRadius: 8,
  transition: "background-color 0.15s ease, color 0.15s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === "light" ? 0.06 : 0.1),
    color: theme.palette.text.primary,
  },
  "&.active": {
    backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === "light" ? 0.1 : 0.16),
    color: theme.palette.primary.main,
    "& .nav-icon": {
      color: theme.palette.primary.main,
    },
    "& .nav-title": {
      fontWeight: 600,
      color: theme.palette.primary.main,
    },
  },
}));

const StyledIcon = styled("span")(({ theme }) => ({
  marginRight: theme.spacing(1.25),
  display: "inline-flex",
  color: theme.palette.text.secondary,
  transition: "color 0.15s ease",
  "& .MuiSvgIcon-root": {
    fontSize: 20,
  },
}));

const StyledTitle = styled(Typography)({
  marginRight: "auto",
  fontSize: "0.8125rem",
  fontWeight: 500,
  lineHeight: 1.4,
});

const NavItem = ({ className, href, icon: Icon, title, ...rest }) => {
  return (
    <StyledItem className={clsx(className)} disableGutters {...rest}>
      <StyledButton
        to={href}
        className={({ isActive }) => (isActive ? "active" : undefined)}
        title={title}
      >
        {Icon && (
          <StyledIcon className="nav-icon">
            <Icon fontSize="small" />
          </StyledIcon>
        )}
        {title && (
          <StyledTitle variant="body2" component="span" className="nav-title">
            {title}
          </StyledTitle>
        )}
      </StyledButton>
    </StyledItem>
  );
};

NavItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string,
};

export default NavItem;
