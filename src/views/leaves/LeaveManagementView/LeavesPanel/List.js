import React from "react";
import PropTypes from "prop-types";

import { Box, Chip, Typography } from "@material-ui/core";

import TableComponent from "../../../../components/TableComponent";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const LEAVE_TYPE_COLOR = {
  annual: "orange",
  maternal: "purple",
  vacation: "lime",
};

const Dot = ({ color = "red" }) => (
  <div
    style={{
      width: "16px",
      height: "16px",
      backgroundColor: color,
      display: "inline-block",
      margin: "5px",
      borderRadius: "50%",
      verticalAlign: "middle",
    }}
  />
);

const List = ({
  leaves,
  isLoading,
  error,
  onRetry,
  employeesMap,
  onEditLeaveClicked,
  onApproveLeaveClicked,
  onDeleteLeaveClicked,
}) => {
  console.log("[LeaveList]: Line 53 -> leaves: ", leaves);
  return (
    <TableComponent
      size="small"
      requestState={{ isLoading, error, onRetry }}
      columns={[
        {
          field: "employeeId",
          label: "Employee",
          renderCell: ({ employeeId }) => {
            const { firstName, lastName } = employeesMap[employeeId] || {};
            const name = `${firstName} ${lastName}`;
            return <Typography variant="h6">{name}</Typography>;
          },
        },
        {
          field: "leaveType",
          label: "Leave Type",
          renderCell: ({ leaveType }) => (
            <div
              style={{
                display: "flex",
                // justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Dot color={LEAVE_TYPE_COLOR[leaveType]} />{" "}
              <Typography>
                {String(leaveType[0]).toUpperCase() +
                  String(leaveType).slice(1)}
              </Typography>
            </div>
          ),
        },
        {
          field: "duration",
          label: "Duration",
          renderCell: ({ duration }) => (
            <Typography>
              {duration === 1
                ? "A day"
                : duration === 0.5
                ? "Half a day"
                : `${duration} days`}
            </Typography>
          ),
        },
        {
          field: "from",
          label: "Period",
          renderCell: ({ startDate, endDate }) => {
            const fromDate = new Date(startDate);
            const toDate = new Date(endDate);
            if (fromDate.toLocaleDateString() === toDate.toLocaleDateString()) {
              return <Typography>{toDate.toDateString()}</Typography>;
            }

            if (
              fromDate.getMonth() !== toDate.getMonth() &&
              fromDate.getFullYear() === toDate.getFullYear()
            ) {
              return (
                <Typography>
                  {`${fromDate.getDate()} ${MONTHS[fromDate.getMonth()]}`} to{" "}
                  {`${toDate.getDate()} ${MONTHS[toDate.getMonth()]}`}
                  {", "}
                  {toDate.getFullYear()}
                </Typography>
              );
            } else {
              return (
                <Typography>
                  {fromDate.getDate()} to {toDate.getDate()}{" "}
                  {MONTHS[toDate.getMonth()]}
                  {", "}
                  {toDate.getFullYear()}
                </Typography>
              );
            }
          },
        },

        {
          label: "Status",
          field: "status",
          renderCell: ({ status }) => (
            <Chip
              size="small"
              color={status === "approved" ? "primary" : "default"}
              label={status}
            />
          ),
        },
      ]}
      data={
        leaves || []
        //   .sort(
        //   (a, b) =>
        //     new Date(a.to).toLocaleDateString() >=
        //     new Date(b.to).toLocaleDateString()
        // )
      }
      rowActions={[
        {
          label: "Approve Leave",
          handler: ({ _id }) => onApproveLeaveClicked(_id),
        },
        { label: "Edit Leave", handler: ({ _id }) => onEditLeaveClicked(_id) },
        {
          label: "Delete Leave",
          handler: ({ _id }) => onDeleteLeaveClicked(_id),
        },
      ]}
    />
  );
};

List.propTypes = {
  /**
   * A flag for request state. True if started but not finished request and false otherwise.
   */
  requesting: PropTypes.bool.isRequired,
  /**
   * An error message if request fails. Null if request still in progress or finished successfully.
   */
  error: PropTypes.string,
  /**
   * List of leave data fetched from api.
   */
  leaves: PropTypes.array.isRequired,
  /**
   * An employee id to object map to look for ease of looking employees details using their _id O(1)
   */
  employeesMap: PropTypes.object.isRequired,
  /**
   * Handler for approve leave button click
   */
  onApproveLeaveClicked: PropTypes.func,
  /**
   * Handler for edit leave button click
   */
  onEditLeaveClicked: PropTypes.func,
  /**
   * Handler for delete leave button click
   */
  onDeleteLeaveClicked: PropTypes.func,
};

export default List;
