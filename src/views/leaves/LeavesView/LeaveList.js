import React from "react";

import {
  Box,
  Card,
  CardContent,
  InputAdornment,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {},
  table: {},
}));

const LeaveList = ({ leaves }) => {
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    console.log("Vhsvdhshdghsgdhsghshfghdghgeybnsbhcbusdghf", value);
    setSearchTerm(value);
  };

  return (
    <Box height="100%" mt={2}>
      <Box mb={1}>
        <Card>
          <CardContent>
            <TextField
              name="searchTerm"
              placeholder="Search leaves"
              variant="outlined"
              onChange={handleChange("searchTerm")}
              value={searchTerm}
              margin="dense"
              InputProps={{
                startAdornment: (
                  <InputAdornment>
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>
      </Box>

      <Paper className={classes.paper}>
        <TableContainer className={classes.table}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves
                .map(
                  ({
                    _id,
                    employee,
                    leaveType,
                    duration,
                    from,
                    to,
                    status,
                  }) => (
                    <TableRow key={_id}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{leaveType}</TableCell>
                      <TableCell>{duration.value}</TableCell>
                      <TableCell>{from}</TableCell>
                      <TableCell>{to}</TableCell>
                      <TableCell>{status}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  )
                )
                .filter(async (d) => {
                  try {
                    return (
                      (await d.employee.firstName) &&
                      null.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                  } catch (error) {
                    console.log(error);
                  }
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default LeaveList;
