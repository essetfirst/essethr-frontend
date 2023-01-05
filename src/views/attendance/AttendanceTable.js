import React from "react";
import PropTypes from "prop-types";

import { Chip, Link, Typography } from "@material-ui/core";
import {
  CheckCircleOutlineRounded as CheckIcon,
  EditRounded as EditIcon,
} from "@material-ui/icons";

import TableComponent from "../../components/TableComponent";
import moment from "moment";

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
            const { _id, firstName, surName } = employeesMap[employeeId] || {};
            const name = employeeName || `${firstName} ${surName}`;
            return (
              <Typography
                variant="h6"
                color="textSecondary"
                component={Link}
                onClick={() => onViewEmployeeClicked(_id)}
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
          renderCell: ({ checkin }) => moment(checkin).format("hh:mm A"),
        },
        {
          label: "CLOCK OUT",
          field: "checkout",
          sortable: true,
          renderCell: ({ checkout }) =>
            checkout ? moment(checkout).format("hh:mm A") : "N/A",
        },
        {
          label: "WORKED HRS",
          field: "workedHours",
          sortable: true,
          renderCell: ({ checkin, checkout }) => {
            if (!checkout)
              return (
                <Typography variant="h6">
                  <i>in progress</i>
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
                  remark === "present"
                    ? "primary"
                    : remark === "absent"
                    ? "secondary"
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
        // {
        //   label: "Edit",
        //   handler: (row) => onEditClicked(row),
        //   icon: <EditIcon size="small" />,

        //   variant: "outlined",
        //   size: "small",
        // },
        {
          label: "Approve",
          handler: ({ _id, status }) => {
            if (status === "approved") {
              return notify({
                message: "Attendance already approved",
                variant: "warning",
              });
            }
            onApproveClicked(_id);
          },
          icon: <CheckIcon size="small" />,
          variant: "outlined",
          size: "small",
        },
      ]}
      selectionEnabled
      selectionActions={[
        {
          icon: <CheckIcon />,
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
