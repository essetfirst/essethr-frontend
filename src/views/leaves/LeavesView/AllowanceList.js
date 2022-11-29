import React from "react";
import PropTypes from "prop-types";

import {
  makeStyles,
  Box,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
} from "@material-ui/core";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import API from "../../../api/leaves";
import useAsync from "../../../utils/useAsync";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

function Row(props) {
  const { employee, allocated, used, allocatedTotal, usedTotal } = props.row;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {employee}
        </TableCell>
        <TableCell align="center">{allocatedTotal}</TableCell>
        <TableCell align="center">{usedTotal}</TableCell>
        <TableCell align="center">{allocatedTotal - usedTotal}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Leave balance
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Leave Type</TableCell>
                    <TableCell align="right">Allocated</TableCell>
                    <TableCell align="right">Used</TableCell>
                    <TableCell align="right">Remaining</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(allocated).map((key) => (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell align="right">{allocated[key]}</TableCell>
                      <TableCell align="right">{used[key]}</TableCell>
                      <TableCell align="right">
                        {allocated[key] - used[key]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    employee: PropTypes.string.isRequired,
    allocated: PropTypes.shape({ leaveType: PropTypes.number }),
    used: PropTypes.shape({ leaveType: PropTypes.number }),
    allocatedTotal: PropTypes.number,
    usedTotal: PropTypes.number,
  }).isRequired,
};

const AllowanceList = () => {
  const [allowances, setAllowances] = React.useState([
    {
      employee: "Abraham Gebrekidan",
      allocated: { maternal: 3, sick: 3, study: 2, annual: 2 },
      used: { maternal: 0, sick: 0, study: 2, annual: 2 },
      allocatedTotal: 10,
      usedTotal: 4,
      remainingTotal: 6,
    },
  ]);

  useAsync(
    API.getAllowances,
    (res) => setAllowances(res.success ? res.allowances : []),
    (err) => {
      console.error(err);
    }
  );

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Employee</TableCell>
            <TableCell>Allocated</TableCell>
            <TableCell>Used</TableCell>
            <TableCell>Remaining</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {allowances.map(({ employee, ...rest }) => (
            <Row key={employee} row={{ employee, ...rest }} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default AllowanceList;
