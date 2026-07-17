import { fmt, fromNow } from "utils/date";
import React from "react";
import { useReactToPrint } from "react-to-print";
import { Box, Chip, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import TableComponent from "components/TableComponent";
import PrintableMultipleEmployeeIDCards from "./PrintableMultipleEmployeeIDCards";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PhoneIcon from "@mui/icons-material/Phone";
import PrintIcon from "@mui/icons-material/Print";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import LinearProgress from "@mui/material/LinearProgress";

const StyledRoot = styled("div")(({ theme }) => ({
  width: "100%",
  "& > * + *": {
    marginTop: theme.spacing(2),
  },
}));

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
  branchLabel,
  requesting,
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
        <StyledRoot>
          <LinearProgress />
        </StyledRoot>
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
                label: "Branch",
                field: "org",
                renderCell: ({ org: employeeOrg }) => (
                  <Typography variant="body2">
                    {branchLabel ? branchLabel(employeeOrg) : "—"}
                  </Typography>
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
                renderCell: ({ position }) => (
                  <Typography variant="h6">
                    {parseFloat(
                      (positionsMap[position] || {}).salary || 0
                    ).toLocaleString("en-US", {
                      style: "currency",
                      currency: "ETB",
                    })}
                  </Typography>
                ),
              },

              {
                label: "Hired",
                field: "hireDate",
                renderCell: ({ hireDate }) => (
                  <Typography variant="h6">
                    {fmt(hireDate, "MMM dd, yyyy")} (
                    {fromNow(hireDate)})
                  </Typography>
                ),
              },
              {
                label: "Status",
                field: "status",
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
                        eStatus === "active"
                          ? "primary"
                          : eStatus === "inactive"
                          ? "secondary"
                          : "default"
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
                icon: <EditIcon fontSize="small" style={{ color: "orange" }} />,
                label: "Edit Details",
                handler: ({ _id }) => onEditClicked(_id),
              },
              {
                icon: <TransferWithinAStationIcon fontSize="small" color="primary" />,
                label: "Transfer branch",
                handler: ({ _id }) => onTransferClicked(_id),
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
            requestState={requesting}
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
