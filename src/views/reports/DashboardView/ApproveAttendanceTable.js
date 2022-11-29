import React from "react";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ChevronRight } from "react-feather";

const ApproveAttendanceTable = ({ attendance = [] }) => {
  return (
    <TableContainer>
      <Toolbar>
        <Typography variant="h3">Attendance to approve</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Worked Hours</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendance.map(({ employeeName, workedHours, status }) => (
            <TableRow>
              <TableCell>{employeeName}</TableCell>
              <TableCell>{workedHours}</TableCell>
              <TableCell>{status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <Button color="primary" endIcon={<ChevronRight />}>
            View all
          </Button>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default ApproveAttendanceTable;
