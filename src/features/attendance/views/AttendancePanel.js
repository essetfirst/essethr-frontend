import { differenceInMinutes } from "date-fns";
import { fmt, toDate } from "utils/date";
import React from "react";
import { useNavigate } from "react-router-dom";

import { useSnackbar } from "notistack";

import TimerOffIcon from "@mui/icons-material/TimerOff";
import { Button, ButtonGroup, Box } from "@mui/material";
import AlarmAddIcon from "@mui/icons-material/AlarmAdd";
import {
  UploadCloud as ImportIcon,
  Download as ExportIcon,
} from "react-feather";
import useOrg from "features/org/providers";
import useNotificationSnackbar from "providers/notification-snackbar";
import useAttendance from "features/attendance/providers";
import API from "api";

import filter from "helpers/filter";
import sort from "helpers/sort";
import { getTableDataForExport, makeExcel } from "helpers/export";

import FilterBar from "./FilterBar";
import AttendanceTable from "./AttendanceTable";
import EditAttendanceDialog from "./EditAttendanceDialog";
import RegisterAttendanceDialog from "./RegisterAttendanceDialog";

const AttendancePanel = () => {
  const navigate = useNavigate();

  const { org } = useOrg();

  const employeesMap = React.useMemo(() => {
    const map = {};
    (org.employees || []).forEach((emp) => {
      if (emp._id != null) map[String(emp._id)] = emp;
      if (emp.employeeId != null) map[String(emp.employeeId)] = emp;
    });
    return map;
  }, [org.employees]);

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

  const getSortedAttendanceList = React.useCallback(
    (attendance, sortBy, sortOrder) => {
      return sort(attendance || [], sortBy, sortOrder);
    },
    []
  );

  const [sortBy, setSortBy] = React.useState("_id");
  const [sortOrder, setSortOrder] = React.useState("desc");

  const [sorteddata, setSortedAttendanceList] = React.useState(
    state.attendanceByDate[attendanceDate] || []
  );

  const onSortParamsChangeFn = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);

    const sortedAttendanceList = getSortedAttendanceList(
      state.attendanceByDate[attendanceDate] || [],
      newSortBy,
      newSortOrder
    );
    setSortedAttendanceList(sortedAttendanceList);
  };

  const handleSortRequest = (sortParams) => {
    const isAsc = sortBy === sortParams && sortOrder === "asc";
    onSortParamsChangeFn(sortParams, isAsc ? "desc" : "asc");
  };

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

  const handleRefreshClick = () => {
    fetchAttendance(null, null, attendanceDate);
  };

  const fileInputRef = React.useRef(null);
  const [importing, setImporting] = React.useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const res = await API.attendance.importAttendance(file);
      if (res?.success) {
        notify(`Imported ${res.imported} attendance row(s).`, "success");
        handleRefreshClick();
      } else {
        notify(res?.error || "Import failed.", "error");
      }
    } catch (err) {
      notify("Import failed.", "error");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const handleExportClick = async () => {
    if (
      Object.keys(state.attendanceByDate).length > 0 &&
      state.attendanceByDate[attendanceDate] &&
      state.attendanceByDate[attendanceDate].length > 0
    ) {
      const filename = "Attendance";

      const rows = state.attendanceByDate[attendanceDate].map(
        ({ _id, date, employeeId, checkin, checkout, remark, status }) => ({
          _id,
          date: fmt(date, "dd/MM/yyyy"),
          employeeId,
          employeeName: employeesMap[employeeId]
            ? employeesMap[employeeId].firstName +
              " " +
              employeesMap[employeeId].surName
            : "N/A",
          checkin: checkin ? fmt(checkin, "hh:mm a") : "N/A",
          checkout: checkout ? fmt(checkout, "hh:mm a") : "N/A",
          workedHours:
            checkin && checkout
              ? (() => {
                  const mins = differenceInMinutes(toDate(checkout), toDate(checkin));
                  if (mins < 0) return "N/A";
                  return `${Math.floor(mins / 60)}hr ${mins % 60}min`;
                })()
              : "N/A",

          remark,
          status,
        })
      );

      const columns = [
        { label: "Date", field: "date" },
        { label: "EmployeeId", field: "employeeId" },
        { label: "Employee Name", field: "employeeName" },
        { label: "Checkin", field: "checkin" },
        { label: "Checkout", field: "checkout" },
        { label: "Worked Hours", field: "workedHours" },
        { label: "Remark", field: "remark" },
        { label: "Status", field: "status" },
      ];

      await makeExcel(getTableDataForExport(rows, columns), filename);
    }
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
      notify("Please select at least one attendance", "error");
      return;
    }

    if (!state.attendanceByDate || !state.attendanceByDate[attendanceDate]) {
      notify("No attendance found", "error");
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

  React.useEffect(() => {
    onSortParamsChangeFn(sortBy, sortOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.attendanceByDate, attendanceDate]);

  return (
    <React.Fragment>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        style={{ display: "none" }}
        onChange={handleImportFile}
      />
      <Box display="flex" justifyContent="space-between">
        <ButtonGroup size="small" aria-label="small outlined button group">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleClockinClick}
            aria-label="clock in"
            startIcon={<AlarmAddIcon size="small" />}
          >
            Clock in
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={handleClockoutClick}
            aria-label="clock out"
            endIcon={<TimerOffIcon size="small" />}
          >
            Clock out
          </Button>
        </ButtonGroup>
        <ButtonGroup size="small" aria-label="small outlined button group">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<ImportIcon />}
            onClick={handleImportClick}
            aria-label="import attendance"
            title="Import attendance from Excel (.xlsx)"
            disabled={importing}
          >
            {importing ? "Importing…" : "Import"}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<ExportIcon />}
            onClick={handleExportClick}
            aria-label="download attendance"
            title="Export attendance to excel"
            disabled={
              !state.attendanceByDate ||
              !state.attendanceByDate[attendanceDate] ||
              state.attendanceByDate[attendanceDate].length === 0
            }
          >
            Export
          </Button>
        </ButtonGroup>
      </Box>
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
        notify={notify}
      />
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
          getFilteredAttendanceList(sorteddata, filters)
        )}
        onSortParamsChange={handleSortRequest}
        onEditClicked={handleEditClick}
        onApproveClicked={handleApproveClick}
        onViewEmployeeClicked={handleViewEmployeeClick}
        notify={notify}
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
    </React.Fragment>
  );
};

export default AttendancePanel;
