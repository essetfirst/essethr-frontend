import React from "react";

import moment from "moment";

import { Box, Chip } from "@material-ui/core";

import TableComponent from "../../../components/TableComponent";

const Attendance = ({ attendanceByDate }) => {
  // attendanceByDate:
  //  {
  //    '12-02-2021': { employeeId: '', date: '', checkin: 10, checkout: 20, remark: '', status: '', device: '' }
  //    '12-02-2021': { employeeId: '', date: '', checkin: 10, checkout: 20, remark: '', status: '', device: '' }
  //    '12-02-2021': { employeeId: '', date: '', checkin: 10, checkout: 20, remark: '', status: '', device: '' }
  //  }
  //
  return (
    <Box>
      <Box>{/* Export and Print action area */}</Box>
      <Box>{/* Latest weekly attendance record  */}</Box>
      <Box>{/* Filter area */}</Box>
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
            renderCell: ({ checkin }) => moment(checkin).format("hh:mm"),
          },
          {
            label: "Check out",
            field: "checkout",
            renderCell: ({ checkout }) => moment(checkout).format("hh:mm"),
          },
          {
            label: "Worked Hours",
            field: "workedHours",
            renderCell: ({ workedHours }) =>
              `${parseFloat(workedHours).toFixed(2)} hrs`,
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
      />
    </Box>
  );
};

export default Attendance;
