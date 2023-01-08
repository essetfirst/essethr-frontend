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
  onMultipleDeleteClicked,
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
      onMultipleDeleteClicked(id);
    });
  };

  return (
    <>
      {employees.length === 0 && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Typography variant="h4" color="textSecondary">
            <Box fontWeight="fontWeightBold" m={1}>
              <LoadingComponent />
            </Box>
          </Typography>
        </Box>
      )}

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
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </Typography>
                ),
              },

              {
                label: "Hired",
                field: "hireDate",
                renderCell: ({ hireDate }) => (
                  <Typography variant="h6">
                    {moment(hireDate).format("MMM DD,  Y")} (
                    {moment(hireDate).fromNow()})
                  </Typography>
                ),
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
                          : eStatus === "active"
                          ? "primary"
                          : "secondary"
                      }
                      label={eStatus}
                    />
                  );
                },
              },
            ]}
            data={employees || []}
            rowActions={[
              {
                icon: <VisibilityIcon fontSize="small" color="primary" />,
                label: "View Details",
                handler: ({ _id }) => onViewClicked(_id),
              },
              {
                icon: <EditIcon fontSize="small" color="secondary" />,
                label: "Edit Details",
                handler: ({ _id }) => onEditClicked(_id),
              },

              {
                icon: <DeleteIcon fontSize="small" color="error" />,
                label: "Delete Employee",
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
                return {
                  _id,
                  employeeId,
                  firstName,
                  surName,
                  department: (departmentsMap[department] || {}).name,
                  position: (positionsMap[position] || {}).title,
                };
              }
            )}
        />
      </div>
    </>
  );
};

export default ResultsTable;
