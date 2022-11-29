import React from "react";
import PropTypes from "prop-types";

import { DataGrid } from "@material-ui/data-grid";
import { Chip, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "400px",
    flexGrow: 1,
    background: theme.palette.common.white,
    margin: "10px 0",
  },
}));
const Results = ({ payrolls }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <DataGrid
        columns={[
          { field: "id", hide: true, type: "number" },
          {
            field: "title",
            headerName: "Description",
            sortable: false,
            width: 200,
          },
          {
            field: "from",
            headerName: "Pay Period",
            type: "date",
            renderCell: (params) => `${params.value}   to   ${params.value}`,
            width: 180,
          },
          { field: "payDate", headerName: "Pay Date", type: "date" },
          {
            field: "status",
            headerName: "Status",
            renderCell: (value) =>
              value === "pending" ? (
                <Chip label="Pending" color="primary" />
              ) : value === "approved" ? (
                <Chip label="Approved" color="secondary" />
              ) : (
                <Chip label="Rejected" />
              ),
          },
          {
            field: "totalEmployeesPaid",
            type: "number",
            headerName: "Employees in Payroll",
            width: 180,
          },
          {
            field: "totalPaidAmount",
            type: "number",
            headerName: "Total Amount",
            width: 200,
          },
        ]}
        rows={payrolls}
      />
    </div>
  );
};

Results.propTypes = {
  payrolls: PropTypes.array.isRequired,
};
export default Results;
