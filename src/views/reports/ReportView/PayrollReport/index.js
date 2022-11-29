import { Link, Typography } from "@material-ui/core";
import React from "react";

import TableComponent from "../../../../components/TableComponent";

const PayrollReport = ({ byMonth, payments }) => {
  return (
    <div>
      {/* Payroll Report */}
      {/* By month */}
      {/* Payments */}
      <TableComponent
        columns={[
          { field: "employeeId", label: "Employee" },
          {
            field: "totalAmount",
            label: "Gross Amount",
            renderCell: ({ totalAmount }) => `ETB ${parseInt(totalAmount)}`,
          },
          {
            field: "paystubs",
            label: "Payslips",
            renderCell: ({ paystubs }) =>
              paystubs.map((payslipId) => (
                <Typography
                  key={payslipId}
                  component={Link}
                  href={`/app/payslips/${payslipId}`}
                >
                  {String(payslipId).slice(-4).toUpperCase()}
                </Typography>
              )),
          },
        ]}
        data={Object.values(payments)}
      />
    </div>
  );
};

export default PayrollReport;
