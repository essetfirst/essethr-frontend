import React from "react";
import PropTypes from "prop-types";

import {
  Avatar,
  colors,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    padding: theme.spacing(2),
  },
  avatar: {
    borderRadius: "5px",
    marginRight: "16px",
    width: "48px",
    height: "48px",
    background: colors.deepPurple[600],
  },
}));

const EmployeeAvatar = ({ _id, avatar, name }) => {
  const classes = useStyles();

  const initials = name
    .split(" ")
    .map((t) => t[0])
    .join("");

  return (
    <div className={classes.root}>
      <Avatar
        alt={name}
        variant="square"
        src={avatar}
        className={classes.avatar}
      >
        {`${initials}`}
      </Avatar>
      <div>
        <Typography
          variant="h6"
          component={Link}
          href={"/app/employees/" + _id}
        >
          {`${name}`}
        </Typography>
      </div>
    </div>
  );
};

EmployeeAvatar.propTypes = {
  /**
   * The avatar image of employee to be displayed
   */
  avatar: PropTypes.string,
  /**
   * Name of the employee
   */
  name: PropTypes.string.isRequired,
};

export default EmployeeAvatar;
