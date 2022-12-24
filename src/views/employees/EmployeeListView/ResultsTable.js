import React from "react";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { Box, Chip, Link, Typography } from "@material-ui/core";
import TableComponent from "../../../components/TableComponent";
import CustomAvatar from "../../../components/CustomAvatar";
import PrintableMultipleEmployeeIDCards from "./PrintableMultipleEmployeeIDCards";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PhoneIcon from "@material-ui/icons/Phone";
import PrintIcon from "@material-ui/icons/Print";
import LoadingComponent from "../../../components/LoadingComponent";
const ResultsTable = ({
  org,
  onSortParamsChange,
  employees = [],
  departmentsMap = {},
  positionsMap = {},
  onViewClicked,
  onEditClicked,
  onTransferClicked,
  onDeleteClicked,
  requestState,
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
      {employees.length === 0 && <LoadingComponent />}
      {employees.length > 0 && (
        <>
          <TableComponent
            size="small"
            columns={[
              {
                label: "Full NAME",
                field: "firstName",
                renderCell: ({ _id, firstName, surName, phone }) => (
                  <Box display="flex" alignItems="center">
                    <CustomAvatar color="secondary" size="1">
                      {`${firstName ? firstName.charAt(0) : ""}${
                        surName ? surName.charAt(0) : ""
                      }`}
                    </CustomAvatar>
                    <div>
                      <Typography
                        variant="h6"
                        color="textSecondary"
                        component={Link}
                        onClick={() => onViewClicked(_id)}
                        style={{ cursor: "pointer" }}
                      >
                        {`${firstName} ${surName}`}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <PhoneIcon
                          fontSize="small"
                          size="16"
                          style={{ verticalAlign: "middle", marginRight: 5 }}
                        />
                        {phone}
                      </Typography>
                    </div>
                  </Box>
                ),
              },
              {
                label: "Job Title",
                field: "position",
                renderCell: ({ position }) => (
                  <Typography variant="h6">
                    {(positionsMap[position] || {}).title || "N/A"}
                  </Typography>
                ),
              },
              {
                label: "SALARY",
                field: "salary",
                sortable: false,
                renderCell: ({ position }) => (
                  <Typography variant="h6">
                    {parseFloat(
                      (positionsMap[position] || {}).salary || 0
                    ).toFixed(2)}{" "}
                    ETB
                  </Typography>
                ),
              },

              {
                label: "Hired",
                field: "hireDate",
                renderCell: ({ hireDate }) =>
                  `${moment(hireDate).format("MMM DD,  Y")} (
                ${moment(hireDate).fromNow()}
              )`,
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
                          ? "error"
                          : eStatus === "Active"
                          ? "primary"
                          : "secondary"
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
                icon: <VisibilityIcon fontSize="small" />,
                label: "View",
                handler: ({ _id }) => onViewClicked(_id),
              },
              {
                icon: <EditIcon fontSize="small" />,
                label: "Edit",
                handler: ({ _id }) => onEditClicked(_id),
              },

              {
                icon: <DeleteIcon fontSize="small" />,
                label: "Delete",
                handler: ({ _id }) => onDeleteClicked(_id),
              },
            ]}
            selectionEnabled={true}
            requestState={requestState}
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
            // onSelectionChanged={(selected) => setSelected(selected)}
            onSortParamsChange={onSortParamsChange}
            {...rest}
          />
        </>
      )}

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
