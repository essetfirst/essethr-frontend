import React from "react";

import moment from "moment";

import { Box, Chip, Typography } from "@material-ui/core";

import TableComponent from "../../../components/TableComponent";

const Attendance = ({ attendanceByDate, onSortParamsChange }) => {
  return (
    <Box>
      <TableComponent
        size="medium"
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
            renderCell: ({ checkout }) => {
              if (!checkout)
                return (
                  <Typography variant="h6">
                    <i>not checked out</i>
                  </Typography>
                );
              return moment(checkout).format("hh:mm A");
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
