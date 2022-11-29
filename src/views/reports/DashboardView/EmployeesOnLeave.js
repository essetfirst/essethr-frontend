import { Avatar, Typography } from "@material-ui/core";
import React from "react";

const EmployeesOnLeave = ({
  employees = [
    { name: "", src: "" },
    { name: "", src: "" },
  ],
}) => {
  return (
    <div>
      <Typography variant="h6">Who is out today?</Typography>
      <AvatarGroup max={4}>
        {employees.map(({ name, src }) => (
          <Avatar key={name} alt={name} src={src} />
        ))}
      </AvatarGroup>
    </div>
  );
};

export default EmployeesOnLeave;
