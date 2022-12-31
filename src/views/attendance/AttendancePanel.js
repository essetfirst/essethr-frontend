import React from "react";
import { useNavigate } from "react-router-dom";

import { useSnackbar } from "notistack";

import TimerOffIcon from "@material-ui/icons/TimerOff";
import { Button, ButtonGroup, Box } from "@material-ui/core";
import AlarmAddIcon from "@material-ui/icons/AlarmAdd";
import {
  UploadCloud as ImportIcon,
  Download as ExportIcon,
} from "react-feather";

import useOrg from "../../providers/org";
import useNotificationSnackbar from "../../providers/notification-snackbar";
import useAttendance from "../../providers/attendance";

import arrayToMap from "../../utils/arrayToMap";
import filter from "../../helpers/filter";
// import getWeekDates from "../../helpers/get-week-dates";
import sort from "../../helpers/sort";
import { getTableDataForExport, makeExcel } from "../../helpers/export";

// import AttendanceSummary from "./AttendanceSummary";
import FilterBar from "./FilterBar";
import AttendanceTable from "./AttendanceTable";
import EditAttendanceDialog from "./EditAttendanceDialog";
import RegisterAttendanceDialog from "./RegisterAttendanceDialog";

const getDateString = (date) => {
  return new Date(date ? date : new Date()).toISOString().slice(0, 10);
};

const AttendancePanel = () => {
  const navigate = useNavigate();

  const { org } = useOrg();
  const employeesMap = arrayToMap(org.employees || [], "employeeId");

  const { state, fetchAttendance, approveAttendance } = useAttendance();

  const { notificationSnackbar } = useNotificationSnackbar();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notify = notificationSnackbar(enqueueSnackbar, closeSnackbar);

  const [attendanceDate, changeAttendanceDate] = React.useState(
    new Date().toISOString().slice(0, 10)
  );

  const handleAttendanceDateChange = (newDate) => {
    changeAttendanceDate(newDate);
  };

  React.useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const [filters, setFilters] = React.useState({
    searchTerm: "",
    remark: "all",
  });
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const comparisonFns = {
    searchTerm: ({ employeeName }, searchTermFilterValue) =>
      searchTermFilterValue
        ? employeeName
          ? employeeName.includes(searchTermFilterValue)
          : true
        : true,
    remark: ({ remark }, remarkFilterValue) =>
      remarkFilterValue && remarkFilterValue !== "all"
        ? remark === remarkFilterValue
        : true,
  };
  const getFilteredAttendanceList = React.useCallback(
    (attendance, filters) => {
      return filter(
        attendance || [],
        Object.keys(filters).map((key) => ({
          value: filters[key],
          cmpFn: comparisonFns[key],
        }))
      );
    },
    [comparisonFns]
  );

  const initialSortParamsValue = { sortBy: "_id", sortOrder: "asc" };
  const [sortParams, setSortParams] = React.useState(initialSortParamsValue);
  const handleSortParamsChange = (newSortParams) =>
    setSortParams({ ...newSortParams });
  // const handleSortParamsReset = () => setSortParams(initialSortParamsValue);
  const getSortedAttendanceList = React.useCallback(
    (attendance, sortBy, sortOrder) => {
      return sort(attendance || [], sortBy, sortOrder);
    },
    []
  );

  const [registerAction, setRegisterAction] = React.useState("checkin");
  const [registerDialogOpen, setRegisterDialogOpen] = React.useState(false);
  const handleRegisterDialogClose = () => {
    setRegisterDialogOpen(false);
    handleRefreshClick();
  };
  const handleClockinClick = () => {
    setRegisterAction("checkin");
    setRegisterDialogOpen(true);
  };
  const handleClockoutClick = () => {
    setRegisterAction("checkout");
    setRegisterDialogOpen(true);
  };

  const handleImportClick = () => {};

  const handleExportClick = async () => {
    console.log("Im about Export data", state);
    const columns = [
      { label: "Date", field: "date" },
      { label: "EmployeeId", field: "employeeId" },
      { label: "Employee", field: "employeeName" },
      { label: "Checkin", field: "checkin" },
      { label: "Checkout", field: "checkout" },
      { label: "Worked Hours", field: "workedHours" },
      { label: "Remark", field: "remark" },
      { label: "Status", field: "status" },
    ];

    console.log(state);
    await makeExcel(getTableDataForExport(state.attendanceByDate, columns));
  };

  const handleRefreshClick = () => {
    fetchAttendance(null, null, attendanceDate);
  };

  const [selectedAttendance, setSelectedAttendance] = React.useState(null);

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    handleRefreshClick();
  };
  const handleEditClick = (attendance) => {
    setSelectedAttendance(attendance);
    setEditDialogOpen(true);
  };

  const handleApproveClick = (attendanceIds) => () => {
    if (attendanceIds.length === 0) {
      return;
    }

    if (!state.attendanceByDate || !state.attendanceByDate[attendanceDate]) {
      return;
    }

    const employees = state.attendanceByDate[attendanceDate]
      .filter((a) => attendanceIds.includes(a._id))
      .map((a) => a.employeeId);
    const date = attendanceDate;
    approveAttendance(employees, date, notify);
  };

  const handleViewEmployeeClick = (id) => {
    navigate("/app/employees/" + id);
  };

  React.useEffect(() => {
    fetchAttendance(null, null, attendanceDate);
  }, [attendanceDate, fetchAttendance]);

  return (
    <div>
      <Box display="flex" justifyContent="space-between">
        <ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleClockinClick}
            aria-label="clock in"
            startIcon={<AlarmAddIcon />}
          >
            Clock in
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={handleClockoutClick}
            aria-label="clock out"
            endIcon={<TimerOffIcon />}
          >
            Clock out
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<ImportIcon />}
            onClick={handleImportClick}
            aria-label="import attendance"
          >
            Import
          </Button>
          {/* <Divider orientation="vertical"  /> */}
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<ExportIcon />}
            onClick={handleExportClick}
            aria-label="download attendance"
            title="Export attendance to excel"
          >
            Export
          </Button>
        </ButtonGroup>
      </Box>
      <Box mb={2} />
      <RegisterAttendanceDialog
        employees={(org.employees || []).map(
          ({ _id, employeeId, firstName, surName }) => ({
            id: employeeId || _id,
            name: `${firstName} ${surName}`,
          })
        )}
        action={registerAction}
        open={registerDialogOpen}
        onClose={handleRegisterDialogClose}
      />

      {/* <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <AttendanceSummary
            totalEmployees={Object.keys(employeesMap).length}
            attendanceByDate={state.attendanceByDate}
            currentDate={attendanceDate}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}></Grid>
      </Grid> */}

      <Box mb={2} />
      <FilterBar
        attendanceDate={attendanceDate}
        onAttendanceDateChange={handleAttendanceDateChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefreshClicked={handleRefreshClick}
      />

      <AttendanceTable
        employeesMap={employeesMap}
        requestState={{ ...state, onRetry: handleRefreshClick }}
        attendance={getSortedAttendanceList(
          getFilteredAttendanceList(
            state.attendanceByDate[getDateString(attendanceDate)],
            filters
          ),
          sortParams.sortBy,
          sortParams.sortOrder
        )}
        // attendance={state.attendanceByDate[getDateString(attendanceDate)] || []}
        onSortParamsChange={handleSortParamsChange}
        onEditClicked={handleEditClick}
        onApproveClicked={handleApproveClick}
        onViewEmployeeClicked={handleViewEmployeeClick}
      />

      {selectedAttendance && (
        <EditAttendanceDialog
          open={editDialogOpen}
          onClose={handleEditDialogClose}
          attendance={selectedAttendance}
          employee={
            selectedAttendance && employeesMap
              ? employeesMap[selectedAttendance.employeeId]
              : {}
          }
        />
      )}
    </div>
  );
};

export default AttendancePanel;
