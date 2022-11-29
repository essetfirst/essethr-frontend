import React from "react";

import { Avatar } from "@material-ui/core";

const SIZES = [32, 48, 64, 96, 128, 144, 196];

const CustomAvatar = ({ size = 0, children, ...rest }) => {
  const width = SIZES[size];
  const height = SIZES[size];
  return (
    <Avatar
      variant="square"
      style={{ borderRadius: 5, width, height, margin: "0px 10px" }}
      {...rest}
    >
      {children}
    </Avatar>
  );
};

export default CustomAvatar;
