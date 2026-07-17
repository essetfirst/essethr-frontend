import { fmt, toDate } from "utils/date";
import React from "react";


import { Box, Chip, Typography } from "@mui/material";

import TableComponent from "components/TableComponent";

const Attendance = ({ attendanceByDate, onSortParamsChange }) => {
  return (
    <Box>
      <TableComponent
        size="medium"
        columns={[
          {
            label: "Date",
            field: "date",
            renderCell: ({ date }) => {
              const d = toDate(date);
              return d ? d.toDateString() : "";
            },
          },
          {
            label: "Check in",
            field: "checkin",
            renderCell: ({ checkin }) => fmt(checkin, "hh:mm a"),
          },
          {
            label: "Check out",
            field: "checkout",
            renderCell: ({ checkout }) => {
              if (!checkout)
                return (
                  <Typography variant="h6">
                    <i>not checked out</i>
                  </Typography>
                );
              return fmt(checkout, "hh:mm a");
            },
          },
          {
            label: "Worked Hours",
            field: "workedHours",
            renderCell: ({ checkin, checkout }) => {
              if (!checkout)
                return (
                  <Typography variant="h6">
                    <i>N/A</i>
                  </Typography>
                );
              const checkinDate = new Date(checkin);
              const checkoutDate = checkout ? new Date(checkout) : new Date();
              const workedHourss = checkoutDate - checkinDate;
              const hours = Math.floor(workedHourss / 1000 / 60 / 60);
              const minutes = Math.floor(
                (workedHourss / 1000 / 60 / 60 - hours) * 60
              );
              return (
                <Typography variant="h6" component="span">
                  <span
                    style={{
                      fontSize: "1rem",
                    }}
                  >
                    {hours}
                  </span>{" "}
                  hrs{" "}
                  <span
                    style={{
                      fontSize: "1rem",
                    }}
                  >
                    {minutes}
                  </span>{" "}
                  mins
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
                  remark === "late" || remark === "absent"
                    ? "default"
                    : "primary"
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
        onSortParamsChange={onSortParamsChange}
      />
    </Box>
  );
};

export default Attendance;
