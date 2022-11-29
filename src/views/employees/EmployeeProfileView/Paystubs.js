import React from "react";

import moment from "moment";
import { useReactToPrint } from "react-to-print";

import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  makeStyles,
  MenuItem,
  TextField,
  // Typography,
} from "@material-ui/core";

import { Download as ExportIcon, Printer as PrintIcon } from "react-feather";

import TableComponent from "../../../components/TableComponent";

// import VerticalTableComponent from "../../../components/VerticalTableComponent";

// class PrintableComponent extends React.Component {
//   render() {
//     const { children } = this.props;
//     return children ? (
//       children
//     ) : (
//       <div>
//         <h1>Yay it prints</h1>
//         <p>This is the end.</p>
//       </div>
//     );
//   }
// }

const useStyles = makeStyles((theme) => ({
  root: {},
  textField: {
    minWidth: "30ch",
    margin: theme.spacing(1, 2),
  },
}));
const Paystubs = ({ payslips = [] }) => {
  const classes = useStyles();
  const printableRef = React.useRef();
  const handlePrint = useReactToPrint({ content: () => printableRef.current });

  const [filters, setFilters] = React.useState({
    fromDate: new Date(new Date().setMonth(new Date().getMonth() - (1 % 12)))
      .toISOString()
      .slice(0, 10),
    toDate: new Date().toISOString().slice(0, 10),
    status: "ALL",
  });
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleExportClick = () => {};
  const handlePrintClick = (e) => {
    handlePrint(e);
  };
  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" flexWrap="wrap" mb={2}>
        {/* Export and Print action area */}
        <ButtonGroup>
          <Button
            variant="outlined"
            size="small"
            onClick={handleExportClick}
            aria-label="export"
            startIcon={<ExportIcon />}
          >
            Export as PDF
          </Button>
          <Button
            type="button"
            variant="outlined"
            size="small"
            onClick={handlePrintClick}
            aria-label="print"
            startIcon={<PrintIcon />}
          >
            Print
          </Button>
        </ButtonGroup>
      </Box>
      <Box mb={2}>{/* Total amount recieved and number of payslips  */}</Box>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center">
            {/* Filter area */}
            {/* <Box maxWidth={100}>
          <TextField name="searchTerm" />
        </Box> */}
            <TextField
              className={classes.textField}
              label="From"
              name="fromDate"
              type="date"
              value={filters.fromDate}
              onChange={handleFilterChange}
              variant="outlined"
              margin="dense"
              size="small"
            />
            <TextField
              className={classes.textField}
              label="To"
              name="toDate"
              type="date"
              value={filters.toDate}
              onChange={handleFilterChange}
              variant="outlined"
              margin="dense"
              size="small"
            />
            <TextField
              className={classes.textField}
              label="Status"
              select
              name="status"
              value={filters.status}
              variant="outlined"
              margin="dense"
              size="small"
            >
              {[
                { label: "ALL", value: "ALL" },
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
              ].map(({ label, value }) => (
                <MenuItem value={value} key={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </CardContent>
      </Card>
      {/* <PrintableComponent ref={printableRef}>
        <VerticalTableComponent
          keys={[
            {
              label: "Employee ID",
              field: "employeeId",
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
              renderCell: ({ toDate }) =>
                moment(toDate).toDate().toDateString(),
            },
            {
              label: "Pay Date",
              field: "payDate",
              renderCell: ({ payDate }) =>
                moment(payDate).toDate().toDateString(),
            },
            {
              label: "Received amount",
              field: "netPayment",
              renderCell: ({ netPayment }) => `${netPayment} ETB`,
            },
          ]}
          data={payslips}
        />
      </PrintableComponent> */}
      <TableComponent
        size="small"
        columns={[
          {
            label: "Payroll",
            field: "title",
            renderCell: ({ title }) => title,
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
            label: "Pay Date",
            field: "payDate",
            renderCell: ({ payDate }) =>
              moment(payDate).toDate().toDateString(),
          },
          {
            label: "Received amount",
            field: "netPayment",
            renderCell: ({ netPayment }) => `${netPayment} ETB`,
          },
          {
            label: "Status",
            field: "status",
            renderCell: ({ status }) => (
              <Chip
                color={
                  String(status) === "pending"
                    ? "default"
                    : status === "rejected"
                    ? "error"
                    : status === "approved"
                    ? "primary"
                    : "default"
                }
                label={status || "pending"}
              />
            ),
          },
        ]}
        data={payslips}
      />
    </Box>
  );
};

export default Paystubs;
