import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@material-ui/core";

const ApproveLeaveTable = ({ leaves }) => {
  return (
    <TableContainer>
      <Toolbar>
        <Typography variant="h3">Leaves to approve</Typography>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Employee</TableCell>
            <TableCell>Leave</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default ApproveLeaveTable;
