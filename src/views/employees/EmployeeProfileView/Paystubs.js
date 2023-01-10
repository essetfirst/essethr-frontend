import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
// import { useReactToPrint } from "react-to-print";

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
  Typography,
} from "@material-ui/core";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import TableComponent from "../../../components/TableComponent";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",

    "& .MuiTableCell-root": {
      padding: theme.spacing(1, 2),

      "&:last-child": {
        paddingRight: theme.spacing(2),
      },
    },
  },
  textField: {
    minWidth: "25ch",
    margin: theme.spacing(1, 2),
  },
}));
const Paystubs = ({ payslips = [] }) => {
  const classes = useStyles();
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

  const handleFilterReset = () => {
    setFilters({
      fromDate: new Date(new Date().setMonth(new Date().getMonth() - (1 % 12)))
        .toISOString()
        .slice(0, 10),
      toDate: new Date().toISOString().slice(0, 10),
      status: "ALL",
    });
  };

  const handleExportClick = () => {
    const doc = new jsPDF("p", "pt");
    doc.autoTable({
      head: [
        ["Employee Name", "Pay Date", "Gross payment", "Net payment", "Status"],
      ],
      body: payslips.map((payslip) => [
        payslip.employeeName,
        moment(payslip.payDate).format("DD/MM/YYYY"),
        payslip.earningsTotal.toLocaleString() + " ETB",
        payslip.netPayment.toLocaleString() + " ETB",
        payslip.status,
      ]),
    });

    const fileName = `payslips ${payslips[0].employeeName} ${moment(
      payslips[0].payDate
    ).format("DD/MM/YYYY")}.pdf`;
    doc.save(fileName);
  };

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="flex-end" flexWrap="wrap" mb={2}>
        {/* Export and Print action area */}
        <ButtonGroup>
          <Button
            variant="outlined"
            size="small"
            onClick={handleExportClick}
            aria-label="export"
            startIcon={<PictureAsPdfIcon />}
            disabled={payslips.length === 0}
          >
            Export as PDF
          </Button>
          {/* <Button
            type="button"
            variant="outlined"
            size="small"
            onClick={handlePrintClick}
            aria-label="print"
            startIcon={<PrintIcon />}
          >
            Print
          </Button> */}
        </ButtonGroup>
      </Box>
      <Box mb={2}>
        <Card>
          <CardContent
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box display="flex" alignItems="center" flexWrap="wrap">
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
                onChange={handleFilterChange}
                variant="outlined"
                margin="dense"
                size="small"
              >
                {/* //list of status options to be added here from payslips status */}
                {[
                  { label: "All", value: "ALL" },
                  { label: "Approved", value: "approved" },
                  { label: "Pending", value: "pending" },
                  { label: "Rejected", value: "rejected" },
                ].map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                size="medium"
                onClick={handleFilterReset}
                aria-label="reset"
                width="100%"
                style={{
                  marginLeft: "1rem",
                  backgroundColor: "#00aeef",
                  color: "white",
                }}
              >
                Reset
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <TableComponent
        size="large"
        columns={[
          {
            label: "Payroll",
            field: "payrollTitle",
            renderCell: ({ payrollTitle }) => payrollTitle.toUpperCase(),
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
            renderCell: ({ netPayment }) => {
              return (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  {netPayment.toLocaleString("en-US", {
                    style: "currency",
                    currency: "ETB",
                  })}
                </Typography>
              );
            },
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
        data={(payslips || []).filter((payslip) => {
          const { fromDate, toDate, status } = filters;
          const { payDate } = payslip;
          const isDateInRange =
            moment(payDate).isSameOrAfter(fromDate) &&
            moment(payDate).isSameOrBefore(toDate);
          const isStatusMatched =
            status === "ALL" || String(status).toLowerCase() === status;
          return isDateInRange && isStatusMatched;
        })}
        selectionEnabled
      />
    </Box>
  );
};

export default Paystubs;
