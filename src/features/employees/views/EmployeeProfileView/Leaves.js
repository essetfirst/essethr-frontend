import { toDate } from "utils/date";
import React from "react";

import { Box, Chip, Typography } from "@mui/material";

import TableComponent from "components/TableComponent";
import useOrg from "features/org/providers";
import arrayToMap from "utils/arrayToMap";
const Leaves = ({ leaves = [] }) => {
  const { org } = useOrg();
  const leaveTypeMap = arrayToMap(org.leaveTypes || [], "_id");
  return (
    <Box>
      <TableComponent
        size="small"
        columns={[
          {
            label: "Leave Type",
            field: "leaveType",
            renderCell: ({ leaveType }) => {
              return (
                <Typography variant="body2">
                  {leaveTypeMap[leaveType]?.name}
                </Typography>
              );
            },
          },
          {
            label: "Start Date",
            field: "fromDate",
            renderCell: ({ fromDate: startDate }) => {
              const d = toDate(startDate);
              return d ? d.toDateString() : "";
            },
          },
          {
            label: "End Date",
            field: "toDate",
            renderCell: ({ toDate: endDate }) => {
              const d = toDate(endDate);
              return d ? d.toDateString() : "";
            },
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
        data={leaves || []}
        selectionEnabled
      />
    </Box>
  );
};

export default Leaves;
