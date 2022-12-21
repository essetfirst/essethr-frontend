import React from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useSnackbar } from "notistack";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import PageView from "../../../components/PageView";
import API from "../../../api";
import useOrg from "../../../providers/org";
import useNotificationSnackbar from "../../../providers/notification-snackbar";
import arrayToMap from "../../../utils/arrayToMap";
import filter from "../../../helpers/filter";
import sort from "../../../helpers/sort";
import { getTableDataForExport, makeExcel } from "../../../helpers/export";
import FileImportDialog from "../../../components/common/FileImportDialog";
import Toolbar from "./Toolbar";
import BranchTransferDialog from "./BranchTransferDialog";
import ResultsTable from "./ResultsTable";
import ResultsGrid from "./ResultsGrid";
import DeleteEmployeeDialog from "./DeleteEmployeeDialog";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import GroupRoundedIcon from "@material-ui/icons/GroupRounded";
import {
  Users as EmployeesIcon,
  UploadCloud as ImportIcon,
  Download as ExportIcon,
  Printer as PrintIcon,
  Plus as AddIcon,
  Grid as GridIcon,
  List as ListIcon,
} from "react-feather";

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

  const { notificationSnackbar } = useNotificationSnackbar();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notify = notificationSnackbar(enqueueSnackbar, closeSnackbar);

  React.useEffect(() => {
    org &&
      org.employees &&
      dispatch({ type: types.RECEIVE_EMPLOYEES, payload: org.employees });
    console.log(org.name);
  }, [org, org.employees]);

  const employeesMap = arrayToMap(state.employees, "_id");
  const departmentsMap = arrayToMap(org.departments, "_id");
  const positionsMap = arrayToMap(org.positions, "_id");

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
  const [filters, setFilters] = React.useState("");

  const handleFilterChange = () => (e) => {
    const { value } = e.target;
    setFilters(value);
  };
  const handleFiltersReset = () => setFilters(initialFiltersValue);

  const initialSortParamsValue = { sortBy: "_id", sortOrder: "asc" };
  const [sortParams, setSortParams] = React.useState(initialSortParamsValue);

  const handleSortParamsChange = (newSortParams) =>
    setSortParams({ ...newSortParams });

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

  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [branchTransferDialog, setBranchTransferDialog] = React.useState(false);

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

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteClick = async (_id) => {
    return await API.employees
      .deleteById(_id)
      .then(({ success, error }) => {
        if (success) {
          deleteEmployee(_id);
          notify({ success: true, message: "Employee Delete Succuss" });
          console.log(_id);
        } else {
          console.error(error);
          notify({ success: false, message: "Employee Delete faild" });
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

  const handleExportClick = async ({ _id }) => {
    console.log("im about to export");

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

    console.log(state.employees);
    await makeExcel(getTableDataForExport(state.employees, columns));
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
      title="Employee Management"
      icon={
        <span style={{ verticalAlign: "middle" }}>
          <GroupRoundedIcon fontSize="large" />
        </span>
      }
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
            disabled: !(state.employees.length >= 0),
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
            disabled: !(state.employees.length >= 0),
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
        // onFiltersReset={handleFiltersReset}
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
        }}
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
          employees={(state.employees || []).filter((d) =>
            String(d.firstName).includes(filters)
          )}
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
          employees={(state.employees || []).filter((d) =>
            String(d.firstName).includes(filters)
          )}
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
