import React from "react";

import { useNavigate } from "react-router";

import { Typography } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import TableComponent from "../../../components/TableComponent";

import useOrg from "../../../providers/org";
import arrayToMap from "../../../utils/arrayToMap";

// function PayslipDetailsDialog({ payslip, employeesMap, open, onClose }) {}

const PayslipList = ({ payslips }) => {
  const navigate = useNavigate();
  const { org } = useOrg();

  const employeesMap = arrayToMap(org.employees || [], "_id");

  const handleViewDetailsClick = (payslip) => {
    navigate(`/app/payslips/${payslip._id}`, { state: payslip });
  };

  /* <code>{JSON.stringify(state.details)}</code> */
  return (
    <TableComponent
      size="small"
      selectionEnabled={false}
      columns={[
        {
          field: "employeeId",
          label: "Employee ID",
          renderCell: ({ employeeId }) =>
            String(employeeId)
              .slice(String(employeeId).length - 4)
              .toUpperCase(),
        },
        {
          field: "employeeName",
          label: "Employee",
          renderCell: ({ employeeId }) => {
            const { firstName, lastName } = employeesMap[employeeId] || {};
            const name = `${firstName} ${lastName}`;
            return <Typography variant="h6">{name}</Typography>;
          },
        },
        {
          field: "earningsTotal",
          label: "Earnings",
          renderCell: ({ earningsTotal }) => {
            return earningsTotal.toLocaleString("en-US", {
              style: "currency",
              currency: "ETB",
            });
          },
        },
        {
          field: "deductionsTotal",
          label: "Deductions",
          renderCell: ({ deductionsTotal }) => {
            return deductionsTotal.toLocaleString("en-US", {
              style: "currency",
              currency: "ETB",
            });
          },
        },
        {
          field: "netPayment",
          label: "Net Payment",
          renderCell: ({ netPayment }) => {
            return netPayment.toLocaleString("en-US", {
              style: "currency",
              currency: "ETB",
            });
          },
        },
      ]}
      data={payslips}
      rowActions={[
        {
          label: "View details",
          icon: { node: <VisibilityIcon /> },
          handler: (row) => handleViewDetailsClick(row),
          variant: "inline",
        },
      ]}
    />
  );
};

export default PayslipList;
