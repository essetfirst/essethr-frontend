import React from "react";

import moment from "moment";

import { useReactToPrint } from "react-to-print";

import { Box, Chip, Link, Typography } from "@material-ui/core";
import {
  Edit2 as EditIcon,
  // Mail as EmailIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Printer as PrintIcon,
  ToggleRight as TransferIcon,
} from "react-feather";

import TableComponent from "../../../components/TableComponent";
import CustomAvatar from "../../../components/CustomAvatar";
import PrintableMultipleEmployeeIDCards from "./PrintableMultipleEmployeeIDCards";

const ResultsTable = ({
  org,
  employees = [],
  onSortParamsChange,
  departmentsMap = {},
  positionsMap = {},
  onViewClicked,
  onEditClicked,
  onTransferClicked,
  onDeleteClicked,
  ...rest
}) => {
  const printableIDsRef = React.useRef();
  const handlePrintMultipleIds = useReactToPrint({
    content: () => printableIDsRef.current,
  });

  const [selected, setSelected] = React.useState([]);

  const handlePrintAll = (selected) => () => {
    setSelected(selected);
    handlePrintMultipleIds();
  };

  const handleDeleteAll = (selected) => () => {
    selected.forEach((id) => {
      onDeleteClicked(id);
    });
  };

  return (
    <>
      <TableComponent
        size="small"
        columns={[
          {
            label: "NAME",
            field: "firstName",
            sortable: true,
            renderCell: ({ _id, firstName, surName, phone }) => (
              <Box display="flex" alignItems="center">
                {/* <CustomAvatar color="primary" size="1">
                  {`${firstName[0]}${surName[0]}`}
                </CustomAvatar> */}
                <div>
                  <Typography
                    variant="h6"
                    component={Link}
                    onClick={() => onViewClicked(_id)}
                    style={{ cursor: "pointer" }}
                  >
                    {`${firstName} ${surName}`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {/* <PhoneIcon
                      fontSize="small"
                      size="16"
                      style={{ verticalAlign: "middle", marginRight: 5 }}
                    /> */}
                    {phone}
                  </Typography>
                  {/* <Typography variant="body2">
                  <EmailIcon
                    fontSize="small"
                    size="16"
                    style={{ verticalAlign: "middle", marginRight: "5" }}
                  />
                  {email}
                </Typography> */}
                </div>
              </Box>
            ),
          },
          // {
          //   label: "DEPARTMENT",
          //   field: "department",
          //   sortable: true,
          //   renderCell: ({ department }) => departmentsMap[department].name,
          // },
          {
            label: "Job Title",
            field: "position",
            sortable: true,
            renderCell: ({ position }) => (
              <Typography variant="h6">
                {(positionsMap[position] || {}).title || "N/A"},
              </Typography>
            ),
          },
          {
            label: "Salary",
            field: "salary",
            sortable: false,
            renderCell: ({ position }) => (
              <Typography variant="h6">
                ETB{" "}
                {parseFloat((positionsMap[position] || {}).salary || 0).toFixed(
                  2
                )}
              </Typography>
            ),
          },

          {
            label: "Hired",
            field: "hireDate",
            renderCell: ({ hireDate }) =>
              `${moment(hireDate).format("DD MMM Y")} (${
                moment(new Date()).diff(hireDate, "M") <= 1
                  ? "A month"
                  : moment(new Date()).diff(hireDate, "M") + " months"
              } ago)`,
          },
          {
            label: "STATUS",
            renderCell: ({ status, endDate, hireDate }) => {
              const eStatus =
                status ||
                (!hireDate
                  ? "on probation"
                  : endDate === undefined || !endDate
                  ? "active"
                  : "terminated");
              return (
                <Chip
                  size="small"
                  color={
                    eStatus === "on probation"
                      ? "default"
                      : eStatus === "terminated"
                      ? "secondary"
                      : "primary"
                  }
                  label={eStatus}
                />
              );
            },
          },
        ]}
        data={employees}
        rowActions={[
          {
            icon: <EditIcon fontSize="small" />,
            label: "Edit employee",
            handler: ({ _id }) => onEditClicked(_id),
          },
          {
            icon: <TransferIcon fontSize="small" />,
            label: "Transfer employee",
            handler: ({ _id }) => onTransferClicked(_id),
          },
          {
            icon: <DeleteIcon fontSize="small" />,
            label: "Delete employee",
            handler: ({ _id }) => onDeleteClicked(_id),
          },
        ]}
        selectionEnabled={true}
        selectionActions={[
          {
            label: "Print IDs",
            handler: (selected) => handlePrintAll(selected),
            icon: <PrintIcon />,
            size: "small",
          },
          {
            label: "Delete all",
            handler: (selected) => handleDeleteAll(selected),
            icon: <DeleteIcon />,
            size: "small",
          },
        ]}
        onSortParamsChange={onSortParamsChange}
        {...rest}
      />
      <div style={{ display: "none" }}>
        <PrintableMultipleEmployeeIDCards
          ref={printableIDsRef}
          employees={employees
            .filter((e) => selected.includes(e._id))
            .map(
              ({
                _id,
                employeeId,
                firstName,
                surName,
                department,
                position,
              }) => {
                const employee = {
                  id: employeeId || _id,
                  org: org.name,
                  name: `${firstName} ${surName}`,
                  department: department
                    ? departmentsMap[department].name
                    : "Department",
                  jobTitle: position
                    ? positionsMap[position].title
                    : "Job Title",
                };
                return employee;
              }
            )}
        />
      </div>
    </>
  );
};

export default ResultsTable;
