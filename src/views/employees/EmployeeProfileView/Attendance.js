import React from "react";

import moment from "moment";

import { Box, Chip, Typography } from "@material-ui/core";

import TableComponent from "../../../components/TableComponent";

const Attendance = ({ attendanceByDate }) => {
  console.log(attendanceByDate);
  return (
    <Box>
      <TableComponent
        size="small"
        columns={[
          {
            label: "Date",
            field: "date",
            renderCell: ({ date }) => moment(date).toDate().toDateString(),
          },
          {
            label: "Check in",
            field: "checkin",
            renderCell: ({ checkin }) => moment(checkin).format("hh:mm A"),
          },
          {
            label: "Check out",
            field: "checkout",
            renderCell: ({ checkout }) => moment(checkout).format("hh:mm A"),
          },
          {
            label: "Worked Hours",
            field: "workedHours",
            renderCell: ({ checkin, checkout }) => {
              const checkinTime = moment(checkin);
              const checkoutTime = moment(checkout);
              const duration = moment.duration(checkoutTime.diff(checkinTime));
              const hours = parseInt(duration.asHours());
              const minutes = parseInt(duration.asMinutes()) % 60;
              return (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  {hours}h {minutes}m
                </Typography>
              );
            },
          },
          {
            label: "Remark",
            field: "remark",
            renderCell: ({ remark }) => (
              <Chip
                color={
                  remark === "late" || remark === "absent" ? "error" : "primary"
                }
                label={remark}
              />
            ),
          },
          {
            label: "Status",
            field: "status",
            renderCell: ({ status }) => (
              <Chip
                color={
                  String(status).toLowerCase() === "pending"
                    ? "default"
                    : status === "rejected"
                    ? "error"
                    : "primary"
                }
                label={status}
              />
            ),
          },
        ]}
        data={Object.values(attendanceByDate)}
        selectionEnabled
      />
    </Box>
  );
};

export default Attendance;
