import { fmt, toDate } from "utils/date";
import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
// import { useReactToPrint } from "react-to-print";

import { Box, Button, ButtonGroup, Card, CardContent, Chip, MenuItem, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableComponent from "components/TableComponent";

const StyledRoot = styled("div")(({ theme }) => ({
  width: "100%",

    "& .MuiTableCell-root": {
      padding: theme.spacing(1, 2),

      "&:last-child": {
        paddingRight: theme.spacing(2),
      },
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  minWidth: "25ch",
  margin: theme.spacing(1, 2),
}));
const Paystubs = ({ payslips = [] }) => {
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
    if (!payslips.length) return;
    const doc = new jsPDF("p", "pt");
    doc.autoTable({
      head: [
        ["Employee Name", "Pay Date", "Gross payment", "Net payment", "Status"],
      ],
      body: payslips.map((payslip) => [
        payslip.employeeName,
        fmt(payslip.payDate, "dd/MM/yyyy"),
        (payslip.earningsTotal ?? 0).toLocaleString() + " ETB",
        (payslip.netPayment ?? 0).toLocaleString() + " ETB",
        payslip.status,
      ]),
    });

    const fileName = `payslips ${payslips[0].employeeName} ${fmt(
      payslips[0].payDate
    , "dd/MM/yyyy")}.pdf`;
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
              <StyledTextField
                label="From"
                name="fromDate"
                type="date"
                value={filters.fromDate}
                onChange={handleFilterChange}
                variant="outlined"
                margin="dense"
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <StyledTextField
                label="To"
                name="toDate"
                type="date"
                value={filters.toDate}
                onChange={handleFilterChange}
                variant="outlined"
                margin="dense"
                size="small"
                InputLabelProps={{ shrink: true }}
              />
              <StyledTextField
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
              </StyledTextField>

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
            renderCell: ({ payrollTitle }) =>
              (payrollTitle || "Payroll").toUpperCase(),
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
            label: "Pay Date",
            field: "payDate",
            renderCell: ({ payDate }) => {
              const d = toDate(payDate);
              return d ? d.toDateString() : "";
            },
          },
          {
            label: "Received amount",
            field: "netPayment",
            renderCell: ({ netPayment }) => {
              const amount = netPayment ?? 0;
              return (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  {amount.toLocaleString("en-US", {
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
          const { fromDate, toDate: toDateFilter, status } = filters;
          const payDateStr = fmt(payslip.payDate, "yyyy-MM-dd");
          const isDateInRange =
            payDateStr >= fromDate && payDateStr <= toDateFilter;
          const isStatusMatched =
            status === "ALL" ||
            String(payslip.status || "pending").toLowerCase() ===
              status.toLowerCase();
          return isDateInRange && isStatusMatched;
        })}
        selectionEnabled
      />
    </Box>
  );
};

export default Paystubs;
