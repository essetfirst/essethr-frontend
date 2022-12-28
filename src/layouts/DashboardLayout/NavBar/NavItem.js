import React from "react";
import PropTypes from "prop-types";

import { NavLink as RouterLink } from "react-router-dom";

import clsx from "clsx";
import {
  Button,
  colors,
  ListItem,
  makeStyles,
  Typography,
} from "@material-ui/core";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";

const useStyles = makeStyles((theme) => ({
  item: {
    display: "flex",
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: "flex-start",
    letterSpacing: 0,
    padding: "10px 10px",
    textTransform: "none",
    width: "100%",
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  title: {
    marginRight: "auto",
    textTransform: "uppercase",
    fontSize: "13px",
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  active: {
    color: colors.teal[500],
    "& $title": {
      fontWeight: theme.typography.fontWeightBold,
    },
    "& $icon": {
      color: theme.palette.primary.main,
    },
    backgroundColor: "rgba(0, 0, 0, 0.08)",

    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.08)",
    },

    "&:hover $title": {
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
}));

const NavItem = ({ className, href, icon: Icon, title, ...rest }) => {
  const classes = useStyles();

  return (
    <ListItem
      className={clsx(classes.item, className)}
      disableGutters
      {...rest}
    >
      <Button
        activeClassName={classes.active}
        className={classes.button}
        component={RouterLink}
        to={href}
      >
        {Icon && <Icon className={classes.icon} size="20" />}
        <Typography variant="body2" component="span" className={classes.title}>
          {title}
        </Typography>
      </Button>
    </ListItem>
  );
};

NavItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string,
};

export default NavItem;
