import React from "react";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";

const EmployeeAvatarGroup = ({ employees }) => {
  return (
    <AvatarGroup max={4}>
      {employees.map(({ avatar, title }) => (
        <Avatar alt={title} src={avatar} title={title} key={title} />
      ))}
    </AvatarGroup>
  );
};

const DailyLeaveSummary = ({ leaves }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="body2" component="h1">
          Who's on leave today
        </Typography>
        <Divider />
        <Box pt={1}>
          <EmployeeAvatarGroup
            employees={[
              {
                avatar: "https://picsum.photos",
                title: "Abraham Gebrekidan",
              },
              {
                title: "Anteneh",
                avatar: "https://picsum.photos",
              },
              {
                title: "Endalk Hussien",
                avatar: "https://picsum.photos",
              },
              {
                title: "Daniel Wolday",
                avatar: "https://picsum.photos",
              },
            ]}
          />
        </Box>
        <Box mt={1} />
        <Typography variant="body2" component="h1">
          Upcoming leaves
        </Typography>
        <Divider />
        <Box pt={1}>
          <EmployeeAvatarGroup employees={[]} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default DailyLeaveSummary;
