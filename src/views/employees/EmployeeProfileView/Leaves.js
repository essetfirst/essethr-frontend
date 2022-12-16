import React from "react";

import { Box, Chip } from "@material-ui/core";

import TableComponent from "../../../components/TableComponent";
import moment from "moment";

const Leaves = ({ leaves = [] }) => {
  return (
    <Box>
      <TableComponent
        size="small"
        columns={[
          {
            label: "Leave Type",
            field: "leaveType",
            renderCell: ({ leaveType }) => leaveType.toUpperCase(),
          },
          {
            label: "Start Date",
            field: "fromDate",
            renderCell: ({ fromDate }) =>
              moment(fromDate).toDate().toDateString(),
          },
          {
            label: "End Date",
            field: "toDate",
            renderCell: ({ toDate }) => moment(toDate).toDate().toDateString(),
          },
          {
            label: "Duration",
            field: "duration",
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
        data={leaves || {}}
        selectionEnabled
      />
    </Box>
  );
};

export default Leaves;
