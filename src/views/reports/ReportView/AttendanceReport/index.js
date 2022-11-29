import React from "react";

import { Grid } from "@material-ui/core";

import TableComponent from "../../../../components/TableComponent";

const AttendanceReport = ({ byDate, byRemark, attendance }) => {
  return (
    <div>
      <Grid container>
        <Grid item>{/* Attendance by date */}</Grid>
        <Grid item>{/* Attendance by remark */}</Grid>
      </Grid>
      <TableComponent
        size="small"
        columns={[
          { label: "Employee", field: "employee" },
          { field: "present", label: "present" },
          { field: "late", label: "Late" },
          { field: "absent", label: "Absent" },
        ]}
        data={attendance}
        selectionEnabled={false}
      />
    </div>
  );
};
export default AttendanceReport;
