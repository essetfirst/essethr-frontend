import { fmt } from "utils/date";
import React from "react";
import PropTypes from "prop-types";

import { Chip, Link, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CheckCircleOutlineRounded as CheckIcon } from "@mui/icons-material";

import TableComponent from "components/TableComponent";

const AttendanceTable = ({
  employeesMap,
  requestState,
  attendance,
  onSortParamsChange,
  onEditClicked,
  onApproveClicked,
  onViewEmployeeClicked,
  notify,
}) => {
  return (
    <TableComponent
      size="small"
      columns={[
        {
          label: "Employee",
          field: "employeeId",
          sortable: true,
          renderCell: ({ employeeName, employeeId }) => {
            const emp = employeesMap[employeeId] || {};
            const { _id, firstName, surName } = emp;
            const name =
              employeeName ||
              [firstName, surName].filter(Boolean).join(" ") ||
              emp.employeeId ||
              "Unknown employee";
            return (
              <Typography
                variant="h6"
                color="textSecondary"
                component={Link}
                onClick={() => _id && onViewEmployeeClicked(_id)}
                style={{
                  cursor: "pointer",
                }}
              >
                {name}
              </Typography>
            );
          },
        },
        {
          label: "CLOCK IN",
          field: "checkin",
          sortable: true,
          renderCell: ({ checkin }) => fmt(checkin, "hh:mm a"),
        },
        {
          label: "CLOCK OUT",
          field: "checkout",
          sortable: true,
          renderCell: ({ checkout }) =>
            checkout ? fmt(checkout, "hh:mm a") : " - ",
        },
        {
          label: "WORKED HRS",
          field: "workedHours",
          sortable: true,
          renderCell: ({ checkin, checkout }) => {
            if (!checkout)
              return (
                <Typography variant="h6">
                  <i>not checked out yet</i>
                </Typography>
              );
            const checkinDate = new Date(checkin);
            const checkoutDate = checkout ? new Date(checkout) : new Date();
            const workedHours = checkoutDate - checkinDate;
            const hours = Math.floor(workedHours / 1000 / 60 / 60);
            const minutes = Math.floor(
              (workedHours / 1000 / 60 / 60 - hours) * 60
            );
            return (
              <Typography variant="h6" component="span">
                <span
                  style={{
                    fontSize: "1rem",
                  }}
                >
                  {hours}
                </span>{" "}
                hrs{" "}
                <span
                  style={{
                    fontSize: "1rem",
                  }}
                >
                  {minutes}
                </span>{" "}
                mins
              </Typography>
            );
          },
        },
        {
          label: "REMARK",
          field: "remark",
          renderCell: ({ remark }) => {
            return (
              <Chip
                size="small"
                color={
                  remark === "late"
                    ? "secondary"
                    : remark === "present"
                    ? "primary"
                    : "default"
                }
                label={remark}
              />
            );
          },
        },
        {
          label: "Status",
          field: "status",
          sortable: true,
          renderCell: ({ status }) => (
            <Chip
              size="small"
              color={
                status === "approved"
                  ? "primary"
                  : status === "rejected"
                  ? "secondary"
                  : "default"
              }
              label={status}
            />
          ),
        },
      ]}
      rowActions={[
        {
          label: "Edit",
          icon: <EditIcon fontSize="small" />,
          handler: (row) => onEditClicked(row),
        },
        {
          label: "Approve",
          handler: ({ _id, status, checkin, checkout }) => {
            if (status === "approved") {
              return notify({
                message: "Attendance already approved",
                variant: "warning",
              });
            } else if (status === "rejected") {
              return notify({
                message: "Attendance already rejected",
                variant: "warning",
              });
            } else if (checkin && !checkout) {
              return notify({
                message: "Employee has not checked out yet",
                variant: "warning",
              });
            } else {
              onApproveClicked([_id])();
              return notify({
                message: "Attendance approved",
                variant: "success",
              });
            }
          },
          icon: (
            <CheckIcon
              size="small"
              style={{
                color: "green",
                fontSize: "1.5rem",
              }}
            />
          ),
        },
      ]}
      selectionEnabled={true}
      selectionActions={[
        {
          icon: <CheckIcon size="small" />,
          label: "Approve all",
          handler: (selected) => onApproveClicked(selected),

          variant: "outlined",
          size: "small",
        },
      ]}
      requestState={requestState}
      data={Object.values(attendance)}
      onSortParamsChange={onSortParamsChange}
    />
  );
};

AttendanceTable.propTypes = {
  employeesMap: PropTypes.object,
  requestState: PropTypes.object,
  attendance: PropTypes.array,
  onSortParamsChange: PropTypes.func,
  onEditClicked: PropTypes.func,
  onApproveClicked: PropTypes.func,
  onViewEmployeeClicked: PropTypes.func,
};

export default AttendanceTable;
