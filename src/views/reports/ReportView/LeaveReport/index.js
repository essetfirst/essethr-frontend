import React from "react";

import { Typography } from "@material-ui/core";

import TableComponent from "../../../../components/TableComponent";

const LeaveReport = ({ byType, leaves }) => {
  return (
    <div>
      {/* TODO: byType display */}
      {/* Leaves report */}
      <TableComponent
        columns={[
          { field: "employeeId", label: "Employee" },
          {
            field: "days",
            label: "# of Days",
            renderCell: ({ days }) =>
              ` ${
                days > 1 ? days + " days" : days === 1 ? "A day" : "Half a day"
              }`,
          },
          {
            field: "types",
            label: "Types of Leave",
            renderCell: ({ types }) =>
              types.map((type) => <Typography>{type}</Typography>),
          },
        ]}
        data={leaves}
      />
    </div>
  );
};

export default LeaveReport;
