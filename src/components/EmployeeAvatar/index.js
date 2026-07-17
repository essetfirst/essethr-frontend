import React from "react";
import PropTypes from "prop-types";

import { Avatar, colors, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledRoot = styled("div")(({ theme }) => ({
  display: "flex",
    padding: theme.spacing(2),
}));

const StyledAvatar = styled("div")(({ theme }) => ({
  borderRadius: "5px",
    marginRight: "16px",
    width: "48px",
    height: "48px",
    background: colors.deepPurple[600],
}));

const EmployeeAvatar = ({ _id, avatar, name }) => {

  const initials = name
    .split(" ")
    .map((t) => t[0])
    .join("");

  return (
    <StyledRoot>
      <StyledAvatar
        alt={name}
        variant="square"
        src={avatar}
       >
      >
        {`${initials}`}
      </StyledAvatar>
      <div>
        <Typography
          variant="h6"
          component={Link}
          href={"/app/employees/" + _id}
        >
          {`${name}`}
        </Typography>
      </StyledRoot>
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
