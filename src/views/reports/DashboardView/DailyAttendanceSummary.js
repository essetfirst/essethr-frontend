import React from "react";

import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";

import CardWithTitle from "../../../components/CardWithTitle";

const EmployeeAvatarGroup = ({ employees }) => {
  return (
    <AvatarGroup max={4} style={{ padding: "8px 0" }}>
      {employees.map(({ avatar, title }) => (
        <Avatar alt={title}>
          <img
            src={avatar}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt={title}
          />
        </Avatar>
      ))}
    </AvatarGroup>
  );
};

const DailyAttendanceSummary = ({ attendance = [] }) => {
  return (
    <CardWithTitle title={"Attendance Summary"}>
      <div>
        <Typography variant="body2" component="h1">
          Just clocked in
        </Typography>
        <Divider />
        <EmployeeAvatarGroup
          employees={[
            { avatar: "no_profile.jpg", title: "Abraham" },
            { avatar: "no_profile.jpg", title: "Anteneh" },
          ]}
        />
      </div>
      <div>
        <Typography variant="body2" component="h1">
          Late
        </Typography>
        <Divider />
        <EmployeeAvatarGroup employees={[]} />
      </div>
      <div>
        <Typography variant="body2" component="h1">
          Absent
        </Typography>
        <Divider />
        <EmployeeAvatarGroup employees={[]} />
      </div>
    </CardWithTitle>
  );
};

export default DailyAttendanceSummary;
