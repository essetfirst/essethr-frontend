import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
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
  Typography,
} from "@material-ui/core";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import { Download as ExportIcon, Printer as PrintIcon } from "react-feather";

import TableComponent from "../../../components/TableComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  textField: {
    minWidth: "25ch",
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

  const handleExportClick = () => {
    console.log("Export Pdf");

    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 40;
    const marginRight = 40;
    const marginTop = 40;
    const marginBottom = 20;

    const doc = new jsPDF(orientation, unit, size);

    doc.text(`Employee PaySlips `, marginLeft, marginTop);

    doc.autoTable({
      head: [
        [
          "Payroll Title",
          "Organization",
          "Employee Name",
          "Start Date",
          "End Date",
          "Pay Date",
          "Earnings Total",
          "Deductions Total",
          "Net Payment",
          "Status",
        ],
      ],
      body: payslips.map((pay) => [
        pay.payrollTitle,
        pay.organization,
        pay.employeeName,
        moment(pay.fromDate).format("MM/DD/YYYY"),
        moment(pay.toDate).format("MM/DD/YYYY"),
        moment(pay.payDate).format("MM/DD/YYYY"),
        pay.earningsTotal,
        pay.deductionsTotal,
        pay.netPayment,
        pay.status,
      ]),
      startY: marginTop + doc.autoTableEndPosY() + marginBottom,
      margin: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
      },
      styles: {
        overflow: "linebreak",
        fontSize: 8,
        cellPadding: 2, // a number, array or
        halign: "left",
      },
      columnStyles: {
        0: { columnWidth: "auto" },
      },
      tableWidth: "auto",
      theme: "striped", // 'striped', '
      showHeader: "everyPage",
      tableId: "paystubs",
      tableLineWidth: 1.1,
    });
    doc.save(`PaySlip-${moment().format("MM-DD-YYYY")}.pdf`);
  };

  console.log(payslips);
  const handlePrintClick = (e) => {
    handlePrint(e);
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
            startIcon={<ExportIcon />}
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
          <CardContent>
            <Box display="flex" alignItems="center">
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
                  {netPayment} ETB
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
        data={payslips}
        selectionEnabled
      />
    </Box>
  );
};

export default Paystubs;
