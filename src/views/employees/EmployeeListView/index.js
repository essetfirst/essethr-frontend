import React from "react";
import { useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { useSnackbar } from "notistack";
import { Box, makeStyles } from "@material-ui/core";
import PageView from "../../../components/PageView";
import API from "../../../api";
import useOrg from "../../../providers/org";
import useNotificationSnackbar from "../../../providers/notification-snackbar";
import arrayToMap from "../../../utils/arrayToMap";
import sort from "../../../helpers/sort";
import FileImportDialog from "../../../components/common/FileImportDialog";
import Toolbar from "./Toolbar";
import BranchTransferDialog from "./BranchTransferDialog";
import ResultsTable from "./ResultsTable";
import ResultsGrid from "./ResultsGrid";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import GroupRoundedIcon from "@material-ui/icons/GroupRounded";
import DeleteEmployeeDialog from "./DeleteEmployeeDialog";
import { getTableDataForExport, makeExcel } from "../../../helpers/export";
import {
  UploadCloud as ImportIcon,
  Download as ExportIcon,
  Printer as PrintIcon,
} from "react-feather";

const useStyles = makeStyles(() => ({
  root: {},
  image: {
    marginTop: 50,
    display: "inline-block",
    maxWidth: "100%",
    width: 560,
  },
}));

const types = {
  FETCH_EMPLOYEES: "FETCH_EMPLOYEES",
  RECEIVE_EMPLOYEES: "RECEIVE_EMPLOYEES",
  FETCHING_ERROR: "FETCHING_ERROR",
};

const initialState = {
  employees: [],
  isLoading: false,
  error: null,
};

const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.FETCH_EMPLOYEES:
      return { ...state, isLoading: true, error: null };
    case types.RECEIVE_EMPLOYEES:
      return { ...state, employees: payload, isLoading: false, error: null };
    case types.FETCHING_ERROR:
      return { ...state, isLoading: false, error };
    default:
      return state;
  }
};

const EmployeeListView = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { org, deleteEmployee } = useOrg();

  const { notificationSnackbar } = useNotificationSnackbar();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notify = notificationSnackbar(enqueueSnackbar, closeSnackbar);

  const employeesMap = arrayToMap(state.employees, "_id");
  const departmentsMap = arrayToMap(org.departments, "_id");
  const positionsMap = arrayToMap(org.positions, "_id");

  // const initialFiltersValue = {
  //   searchTerm: "",
  //   department: "ALL",
  //   position: "ALL",
  //   gender: "ALL",
  // };
  const [filters, setFilters] = React.useState("");

  const handleFilterChange = () => (e) => {
    const { value } = e.target;
    setFilters(value);
  };
  const handleFiltersReset = () => {
    setFilters("");
  };

  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [branchTransferDialog, setBranchTransferDialog] = React.useState(false);

  const getSortedList = React.useCallback(
    (employees = [], sortBy, sortOrder) => {
      return sort(employees, sortBy, sortOrder);
    },
    []
  );

  const [viewType, setViewType] = React.useState("list");

  const handleViewChange = (_e, value) => {
    setViewType(value);
  };

  const handleCreateClick = () => {
    navigate("/app/employees/new");
  };
  const handleEditClick = (_id) => {
    navigate("/app/employees/edit/" + _id);
  };
  const handleProfileViewClick = (id) => {
    navigate("/app/employees/" + id);
  };

  const handleBranchTransferDialogOpen = () => setBranchTransferDialog(true);
  const handleBranchTransferDialogClose = () => setBranchTransferDialog(false);

  const handleTransferClick = (_id) => {
    const employee = employeesMap[_id];
    setSelectedEmployee(employee);
    handleBranchTransferDialogOpen();
  };

  const handleBranchTransfer = async (transferInfo) => {
    try {
      const { success, error } = await API.employees.editById(
        transferInfo._id,
        transferInfo
      );
      if (success) {
        notify({ success, message: "Employee transfer successful!" });
      } else {
        console.error(error);
        notify({ success: false, error: "Couldnt execute employee transfer!" });
      }
    } catch (e) {
      console.error(e.message);
      notify({ success: false, error: "Couldnt execute employee transfer." });
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const handleDeleteDialogOpen = () => setDeleteDialogOpen(true);
  const handleDeleteDialogClose = () => setDeleteDialogOpen(false);

  const handleDeleteClickDialog = (_id) => {
    const employee = employeesMap[_id];
    setSelectedEmployee(employee._id);
    handleDeleteDialogOpen();
  };

  const handleDeleteClick = async () => {
    try {
      const { success, error, message } = await API.employees.deleteById(
        selectedEmployee
      );
      if (success) {
        deleteEmployee(selectedEmployee);
        notify({ success, message });
        handleDeleteDialogClose();
      } else {
        console.error(error);
        notify({ success: false, message });
        handleDeleteDialogClose();
      }
    } catch (e) {
      console.error(e.message);
      notify({ success: false, message: "Couldnt delete employee." });
      handleDeleteDialogClose();
    }
  };

  //delete the multiple employees
  const handleDeleteMultipleClick = async (_ids) => {
    try {
      const { success, error, message } = await API.employees.deleteById(_ids);
      if (success) {
        deleteEmployee(_ids);
        notify({ success, message });
        handleDeleteDialogClose();
      } else {
        console.error(error);
        notify({ success: false, message });
      }
    } catch (e) {
      console.error(e.message);
      notify({ success: false, message: "Couldnt delete employee." });
    }
  };

  const [importDialogOpen, setImportDialogOpen] = React.useState(false);

  const handleImportDialogOpen = () => {
    setImportDialogOpen(true);
  };
  const handleImportDialogClose = () => {
    setImportDialogOpen(false);
  };
  const handleImportClick = () => {
    handleImportDialogOpen();
  };

  const handleExportClick = async () => {
    const columns = [
      {
        label: "EmployeeID",
        field: "employeeId",
      },
      {
        label: "First Name",
        field: "firstName",
      },
      {
        label: "Last Name",
        field: "surName",
      },
      {
        label: "EMAIL",
        field: "email",
      },
      {
        label: "Phone",
        field: "phone",
      },
      {
        label: "Gender",
        field: "gender",
      },
      {
        label: "Department",
        field: "department",
      },
      {
        label: "Job Title",
        field: "position",
      },
      {
        label: "Salary",
        field: "salary",
      },
      {
        label: "Hire Date",
        field: "hireDate",
      },
      {
        label: "Start Date",
        field: "startDate",
      },
      {
        label: "Status",
        field: "status",
      },
    ];

    const rows = await state.employees.map((employee) => {
      return {
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        surName: employee.surName,
        email: employee.email,
        phone: employee.phone,
        gender: employee.gender,
        department: departmentsMap[employee.department]
          ? departmentsMap[employee.department].name
          : employee.department,
        position: positionsMap[employee.position]
          ? positionsMap[employee.position].title
          : employee.position,
        salary: positionsMap[employee.position]
          ? positionsMap[employee.position].salary
          : employee.position,
        hireDate: employee.hireDate,
        startDate: employee.startDate,
        status: employee.status,
      };
    });

    await makeExcel(getTableDataForExport(rows, columns), "Employees");
    notify({
      success: true,
      message: "Exporting data to excel successful!",
    });
  };

  //Print the employees list to pdf file and download it using React to Print Component
  const componentRef = React.useRef();
  const handlePrintClick = () => {
    ReactToPrint({
      content: () => componentRef.current,
    });
  };

  //Sorting and Filtering
  const [sortParamss, setSortParamss] = React.useState("firstName");
  const [orderDir, setOrdirDir] = React.useState("asc");

  const onSortParamsChange = (sortParams, orderDir) => {
    setSortParamss(sortParams);
    setOrdirDir(orderDir);
    dispatch({
      type: types.SORT_EMPLOYEES,
      payload: {
        sortParams,
        orderDir,
      },
    });

    const sortedEmployees = getSortedList(
      state.employees,
      sortParams,
      orderDir
    );
    dispatch({
      type: types.RECEIVE_EMPLOYEES,
      payload: sortedEmployees,
      isLoading: false,
      error: null,
    });
  };

  const handleSortRequest = (sortParams) => {
    const isAsc = sortParamss === sortParams && orderDir === "asc";
    onSortParamsChange(sortParams, isAsc ? "desc" : "asc");
  };

  React.useEffect(() => {
    org &&
      org.employees &&
      dispatch({
        type: types.RECEIVE_EMPLOYEES,
        payload: org.employees,
        isLoading: false,
        error: null,
      });
  }, [org, org.employees]);

  return (
    <PageView
      className={classes.root}
      title="Employee"
      icon={
        <span style={{ verticalAlign: "middle" }}>
          <GroupRoundedIcon fontSize="large" />
        </span>
      }
      backPath="/app/dashboard"
      actions={[
        {
          type: "button",
          label: "create",
          icon: { node: <AddCircleRoundedIcon size="16px" /> },
          handler: handleCreateClick,
          otherProps: { variant: "contained", color: "primary", size: "small" },
        },
        {
          type: "button",
          label: "Import",
          icon: { node: <ImportIcon size="16px" /> },
          handler: handleImportClick,
          position: "left",
          otherProps: { size: "small" },
        },
        {
          type: "button",
          label: "Export",
          icon: { node: <ExportIcon size="16px" /> },
          handler: handleExportClick,
          position: "right",
          otherProps: {
            color: "primary",
            disabled: !(state.employees.length > 0),
          },
        },
        {
          type: "button",
          label: "Print",
          icon: { node: <PrintIcon size="16px" /> },
          handler: handlePrintClick,
          position: "right",
          otherProps: {
            color: "primary",
            disabled: !(state.employees.length > 0),
          },
        },
      ]}
    >
      <Box mb={2} />
      <Toolbar
        viewType={viewType}
        onViewTypeChange={handleViewChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        onFiltersReset={handleFiltersReset}
        departments={org.departments}
        positions={org.positions}
      />

      <FileImportDialog
        title={"Import employees data"}
        description={"Drop your files here or click"}
        open={importDialogOpen}
        onClose={handleImportDialogClose}
        onFileRead={(data) => {
          handleImportDialogClose();
        }}
      />

      <DeleteEmployeeDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        employee={selectedEmployee}
        onDelete={handleDeleteClick}
        onMultipleDelete={handleDeleteMultipleClick}
      />

      <BranchTransferDialog
        open={branchTransferDialog}
        onClose={handleBranchTransferDialogClose}
        employee={selectedEmployee}
        onTransfer={handleBranchTransfer}
      />

      {viewType === "list" ? (
        <ResultsTable
          org={org}
          // eslint-disable-next-line array-callback-return
          employees={(state.employees || []).filter((d) => {
            try {
              return (
                String(
                  d.firstName
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                ).includes(filters) ||
                String(d.surName.toLowerCase()).includes(filters) ||
                String(d.position).includes(filters) ||
                String(d.department).includes(filters) ||
                String(d.gender).includes(filters)
              );
            } catch (error) {
              console.log();
            }
          })}
          departmentsMap={departmentsMap}
          onSortParamsChange={handleSortRequest}
          positionsMap={positionsMap}
          onViewClicked={handleProfileViewClick}
          onEditClicked={handleEditClick}
          onTransferClicked={handleTransferClick}
          onDeleteClicked={handleDeleteClickDialog}
          onMultipleDeleteClicked={handleDeleteMultipleClick}
          requesting={state}
        />
      ) : (
        <ResultsGrid
          // eslint-disable-next-line array-callback-return
          employees={(state.employees || []).filter((d) => {
            try {
              return (
                String(
                  d.firstName
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                ).includes(filters) ||
                String(d.surName.toLowerCase()).includes(filters) ||
                String(d.position).includes(filters) ||
                String(d.department).includes(filters) ||
                String(d.gender).includes(filters)
              );
            } catch (error) {}
          })}
          departmentsMap={departmentsMap}
          positionsMap={positionsMap}
          onEditClicked={handleEditClick}
          onTransferClicked={handleTransferClick}
          onDeleteClicked={handleDeleteClick}
          state={state}
        />
      )}
    </PageView>
  );
};

export default EmployeeListView;
