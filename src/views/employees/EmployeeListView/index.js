import React from "react";

import { useNavigate } from "react-router-dom";

import { useReactToPrint } from "react-to-print";

import { useSnackbar } from "notistack";

import { Box, makeStyles, Typography } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import {
  Users as EmployeesIcon,
  UploadCloud as ImportIcon,
  Download as ExportIcon,
  Printer as PrintIcon,
  Plus as AddIcon,
  Grid as GridIcon,
  List as ListIcon,
  // Edit2 as EditIcon,
  // Delete as DeleteIcon,
  // Phone as PhoneIcon,
  // Mail as EmailIcon,
} from "react-feather";

import PageView from "../../../components/PageView";
// import VerticalTableComponent from "../../../components/VerticalTableComponent";
// import ImportJSONFromTabularFileDialog from "../../../components/ImportFromFileDialog";
// import withPrintability from "../../../components/PrintHoC";

import API from "../../../api";

import useOrg from "../../../providers/org";
import useNotificationSnackbar from "../../../providers/notification-snackbar";

import arrayToMap from "../../../utils/arrayToMap";
import filter from "../../../helpers/filter";
import sort from "../../../helpers/sort";
import { readExcelFile } from "../../../helpers/import";
import { getTableDataForExport, makeExcel } from "../../../helpers/export";

import { ImportFileDialogSimple } from "../../../components/common/ImportFileDialog";
import FileImportDialog from "../../../components/common/FileImportDialog";

import Toolbar from "./Toolbar";
import BranchTransferDialog from "./BranchTransferDialog";
import ResultsTable from "./ResultsTable";
import ResultsGrid from "./ResultsGrid";
// import Highlights from "./Highlights";

const useStyles = makeStyles((theme) => ({
  root: {},
  image: {
    marginTop: 50,
    display: "inline-block",
    maxWidth: "100%",
    width: 560,
  },
}));

const types = {
  ADD_EMPLOYEES: "ADD_EMPLOYEES",
  FETCH_EMPLOYEES: "FETCH_EMPLOYEES",
  RECEIVE_EMPLOYEES: "RECEIVE_EMPLOYEES",
  FETCHING_ERROR: "FETCHING_ERROR",
};

const initialState = {
  employees: [],
  isFetching: false,
  error: null,
};

const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.ADD_EMPLOYEES:
      return { ...state, employees: [...state.employees, ...payload] };
    case types.FETCH_EMPLOYEES:
      return { ...state, isFetching: true, error: null };
    case types.RECEIVE_EMPLOYEES:
      return { ...state, employees: payload, isFetching: false, error: null };
    case types.FETCHING_ERROR:
      return { ...state, isFetching: false, error };
    default:
      return state;
  }
};

const EmployeeListView = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const { org, deleteEmployee } = useOrg();

  React.useEffect(() => {
    org &&
      org.employees &&
      dispatch({ type: types.RECEIVE_EMPLOYEES, payload: org.employees });
  }, [org, org.employees]);

  const employeesMap = arrayToMap(state.employees, "_id");
  const departmentsMap = arrayToMap(org.departments, "_id");
  const positionsMap = arrayToMap(org.positions, "_id");

  const { notificationSnackbar } = useNotificationSnackbar();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notify = notificationSnackbar(enqueueSnackbar, closeSnackbar);

  const initialFiltersValue = {
    searchTerm: "",
    department: "ALL",
    position: "ALL",
    gender: "ALL",
    minAge: 18,
    maxAge: 65,
    minSalary: 0,
    maxSalary: 65000,
    sortBy: "",
    sortOrder: "",
  };
  const [filters, setFilters] = React.useState(initialFiltersValue);

  const handleFilterChange = (filterName) => (e) => {
    setFilters({ ...filters, [filterName]: e.target.value });
  };
  const handleFiltersReset = () => setFilters(initialFiltersValue);

  const initialSortParamsValue = { sortBy: "_id", sortOrder: "asc" };
  const [sortParams, setSortParams] = React.useState(initialSortParamsValue);

  const handleSortParamsChange = (newSortParams) =>
    setSortParams({ ...newSortParams });
  // const handleSortParamsReset = () => setSortParams(initialSortParamsValue);

  const comparisonFns = {
    searchTerm: ({ firstName, surName, lastName }, searchTermFilterValue) =>
      searchTermFilterValue
        ? `${firstName} ${surName} ${lastName}`.includes(searchTermFilterValue)
        : true,
    department: ({ department }, departmentFilterValue) =>
      departmentFilterValue && departmentFilterValue !== "ALL"
        ? department === departmentFilterValue
        : true,
    position: ({ position }, positionFilterValue) =>
      positionFilterValue && positionFilterValue !== "ALL"
        ? position === positionFilterValue
        : true,
    gender: ({ gender }, genderFilterValue) =>
      genderFilterValue && genderFilterValue !== "ALL"
        ? gender === genderFilterValue
        : true,

    minAge: ({ birthDay }, minAgeFilterValue) => {
      const age = new Date().getFullYear() - new Date(birthDay).getFullYear();
      return age >= minAgeFilterValue;
    },
    maxAge: ({ birthDay }, maxAgeFilterValue) => {
      const age = new Date().getFullYear() - new Date(birthDay).getFullYear();
      return age <= maxAgeFilterValue;
    },
    minSalary: ({ position }, minSalaryFilterValue) => {
      return positionsMap[position].salary >= minSalaryFilterValue;
    },
    maxSalary: ({ position }, maxSalaryFilterValue) => {
      return positionsMap[position].salary <= maxSalaryFilterValue;
    },
  };

  const getFilteredList = React.useCallback(
    (employees = [], filters, comparisonFns) => {
      return filter(
        employees,
        Object.keys(filters).map((key) => {
          return {
            value: filters[key],
            cmpFn: comparisonFns[key],
          };
        })
      );
    },
    []
  );

  const getSortedList = React.useCallback(
    (employees = [], sortBy, sortOrder) => {
      return sort(employees, sortBy, sortOrder);
    },
    []
  );

  const [viewType, setViewType] = React.useState("list");
  const handleViewChange = (e, value) => {
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

  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [branchTransferDialog, setBranchTransferDialog] = React.useState(false);
  const handleBranchTransferDialogOpen = () => setBranchTransferDialog(true);
  const handleBranchTransferDialogClose = () => setBranchTransferDialog(false);
  // const handleTransferClick = (_id) => {
  //   navigate('/app/employees/transfer', + _id)
  // }
  const handleTransferClick = (_id) => {
    // console.log("[EmployeeListView]: Line 202 -> Transfer clicked፡ ", _id);
    const employee = employeesMap[_id];
    setSelectedEmployee(employee);
    handleBranchTransferDialogOpen();
  };

  const handleBranchTransfer = async (transferInfo) => {
    // Do something async
    try {
      const { success, error } = await API.employees.editById(
        transferInfo._id,
        transferInfo
      );
      if (success) {
        // updateEmployee(employeeInfo);
        // Show notification
        notify({ success, message: "Employee transfer successful!" });
      } else {
        console.error(error);
        // Show notification
        notify({ success: false, error: "Couldnt execute employee transfer!" });
      }
    } catch (e) {
      console.error(e.message);
      // Show notification
      notify({ success: false, error: "Couldnt execute employee transfer." });
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteClick = (_id) => {
    // handleDeleteDialogOpen();
    // handleDeleteEmployee(_id);
  };

  const handleDeleteEmployee = (employeeId) => {
    API.employees
      .deleteById(employeeId)
      .then(({ success, error }) => {
        if (success) {
          // notify user
          deleteEmployee(employeeId);
        } else {
          // notify user
          console.error(error);
        }
      })
      .catch((e) => {
        console.error(e.message);
      });
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

  // const handleImportEmployees = (employees) => {
  //   const attempt = () =>
  //     API.employees
  //       .importEmployees(employees)
  //       .then(({ success, message, error }) => {
  //         if (success) {
  //         }
  //       })
  //       .catch((e) => {
  //         // showNotification({ success: false, error: String(e).includes('Unexpected token') ? 'Something is not right.' });
  //       });
  //   attempt();
  // };

  // const handleAddEmployees = (employees) => {
  //   dispatch({ type: types.ADD_EMPLOYEES, payload: employees });
  // };

  // const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  // const handleImportDialogOpen = () => {
  //   setExportDialogOpen(true);
  // };
  // const handleExportDialogClose = () => {
  //   setExportDialogOpen(false);
  // };
  const handleExportClick = async () => {
    // handleExportDialogOpen();
    if (!state.employees || !(state.emmployees > 0)) return;

    const columns = [
      {
        label: "First Name",
        field: "firstName",
      },
      {
        label: "Sur Name",
        field: "surName",
      },
      {
        label: "Last Name",
        field: "lastName",
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

    await makeExcel(getTableDataForExport(org.employees, columns));
  };

  const printListRef = React.useRef();
  const handlePrintList = useReactToPrint({
    content: () => printListRef.current,
  });
  const handlePrintClick = () => {
    handlePrintList();
  };

  return (
    <PageView
      className={classes.root}
      title="Employees"
      icon={
        <span style={{ verticalAlign: "middle" }}>
          <EmployeesIcon fontSize="large" />
        </span>
      }
      actions={[
        {
          type: "button",
          label: "create",
          icon: { node: <AddIcon size="16px" /> },
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
          otherProps: { disabled: !(state.employees.length > 0) },
        },
      ]}
    >
      {/* I wanna show some stats | how many are active | recently hired | employees on probation ! terminated cases */}

      {/* <Highlights /> */}
      <Box mb={2} />
      <Toolbar
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
          console.log(
            "[EmployeeList]: Line 334 -> Data imported from file: ",
            data
          );
          // readExcelFile(file)
          //   .then((data) => {})
          //   .catch((e) => {});

          // await handleImportEmployees(data);
        }}
      />
      {/* <ImportFileDialogSimple
        title={"Import employees data"}
        description={"Drop your files here or click"}
        open={importDialogOpen}
        onClose={handleImportDialogClose}
        onFileRead={(data) => {
          console.log(
            "[EmployeeList]: Line 334 -> Data imported from file: ",
            data
          );
          // readExcelFile(file)
          //   .then((data) => {})
          //   .catch((e) => {});
        }}
      /> */}
      {/*       
      <ImportJSONFromTabularFileDialog
        open={importDialogOpen}
        onClose={handleImportDialogClose}
        onDropedFileReadAsJSON={({ columns, data }) => {
          console.log("File columns: ", columns);
          console.log("File data: ", data);
        }}
      /> */}

      <BranchTransferDialog
        open={branchTransferDialog}
        onClose={handleBranchTransferDialogClose}
        employee={selectedEmployee}
        onTransfer={handleBranchTransfer}
      />

      <Box display="flex" justifyContent="space-between" mt={1}>
        <Box pl={1} display="flex" alignItems="center">
          <Typography color="textSecondary" variant="body2">
            {`${state.employees.length} ${
              state.employees.length > 1 ? "Employees" : "Employee"
            }`}
          </Typography>
        </Box>
        <ToggleButtonGroup value={viewType}>
          <ToggleButton value="list" size="small" onClick={handleViewChange}>
            <ListIcon
              fontSize="small"
              size="16"
              style={{ marginRight: "5px" }}
            />
            <span>List</span>
          </ToggleButton>
          <ToggleButton value="grid" size="small" onClick={handleViewChange}>
            <GridIcon
              fontSize="small"
              size="16"
              style={{ marginRight: "5px" }}
            />
            <span>Grid</span>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewType === "list" ? (
        <ResultsTable
          org={org}
          // employees={getSortedList(
          //   getFilteredList(state.employees, filters, comparisonFns),
          //   sortParams.sortBy,
          //   sortParams.sortOrder
          // )}
          // employees={getFilteredList(state.employees, filters, comparisonFns)}
          employees={state.employees || []}
          onSortParamsChange={(sortBy, sortOrder) =>
            handleSortParamsChange({ sortBy, sortOrder })
          }
          departmentsMap={departmentsMap}
          positionsMap={positionsMap}
          onViewClicked={handleProfileViewClick}
          onEditClicked={handleEditClick}
          onTransferClicked={handleTransferClick}
          onDeleteClicked={handleDeleteClick}
        />
      ) : (
        <ResultsGrid
          // employees={getSortedList(
          //   getFilteredList(state.employees, filters, comparisonFns),
          //   sortParams.sortBy,
          //   sortParams.sortOrder
          // )}
          // employees={getFilteredList(state.employees, filters, comparisonFns)}
          employees={state.employees || []}
          departmentsMap={departmentsMap}
          positionsMap={positionsMap}
          onEditClicked={handleEditClick}
          onTransferClicked={handleTransferClick}
          onDeleteClicked={handleDeleteClick}
        />
      )}
    </PageView>
  );
};

export default EmployeeListView;
