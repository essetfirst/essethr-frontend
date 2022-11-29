import React from "react";

import { Box, TextField, Typography } from "@material-ui/core";
import { CheckCircleOutlineOutlined as CheckIcon } from "@material-ui/icons";

import {
  Battery as LeaveBalancesIcon,
  Download as ExportIcon,
} from "react-feather";

import useAttendance from "../../../providers/attendance";

import {
  CURRENT_MONTH_END_DATE,
  CURRENT_MONTH_START_DATE,
} from "../../../constants";

import { getTableDataForExport, makeExcel } from "../../../helpers/export";

import PageView from "../../../components/PageView";

import LoadingComponent from "../../../components/LoadingComponent";
import ErrorBoxComponent from "../../../components/ErrorBoxComponent";

import Searchbar from "../../../components/common/Searchbar";
import Table from "../../../components/TableComponent";

const FilterFields = ({ filters, onFilterFieldChange }) => {
  return (
    <Box display="flex" alignItems={"center"}>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        type="date"
        label="From"
        name="from"
        onChange={onFilterFieldChange}
        value={filters.from}
        style={{ marginRight: "8px" }}
      />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="To"
        type="date"
        name="to"
        onChange={onFilterFieldChange}
        value={filters.to}
      />
    </Box>
  );
};

const AbsenteesReportFilterbar = ({ filters, onFilterChange }) => {
  return (
    <Searchbar
      onSearchTermChange={onFilterChange}
      searchTerm={filters.searchTerm}
      searchbarElements={
        <FilterFields filters={filters} onFilterFieldChange={onFilterChange} />
      }
    />
  );
};

const AbsenteesReportTable = ({ data }) => {
  const columns = [
    {
      label: "ID",
      field: "employeeId",
      renderCell: ({ employeeId }) => (
        <Typography variant="h6">{employeeId}</Typography>
      ),
    },
    {
      label: "Employee",
      field: "employee",
      renderCell: ({ employeeName }) => (
        <Typography variant="h6">{employeeName}</Typography>
      ),
    },
    {
      label: "Absent",
      field: "absent",
      align: "center",
      renderCell: ({ absent }) => (
        <Typography variant="h6">{absent}</Typography>
      ),
    },
    {
      label: "Late",
      field: "late",
      align: "center",
      renderCell: ({ late }) => <Typography variant="h6">{late}</Typography>,
    },
    {
      label: "Present",
      field: "present",
      align: "center",
      renderCell: ({ present }) => (
        <Typography variant="h6">{present}</Typography>
      ),
    },
    {
      label: "Approved?",
      field: "status",
      align: "center",
      renderCell: ({ status }) => (
        <CheckIcon color={status === "approved" ? "primary" : "action"} />
      ),
    },
  ];
  return <Table size="small" columns={columns} data={data} />;
};

const LeaveBalancesReportView = () => {
  const { state, fetchAttendance } = useAttendance();

  const [reportData, setReportData] = React.useState(null);

  const handleExportClick = async () => {
    if (reportData.length > 0) {
      const filename = `Absentee report (${new Date(
        filters.from
      ).toLocaleDateString()} to ${new Date(filters.to).toLocaleDateString()})`;

      const rows = reportData.map(({ present, late, absent, ...rest }) => ({
        present: `${present} days`,
        late: `${late} days`,
        absent: `${absent} days`,
        ...rest,
      }));
      const columns = [
        {
          label: "Employee Id",
          field: "employeeId",
        },
        {
          label: "Employee",
          field: "employeeName",
        },
        {
          label: "Start Date",
          field: "startDate",
        },
        {
          label: "End Date",
          field: "endDate",
        },
        {
          label: "Regular",
          field: "workedHours",
        },
        {
          label: "Overtime",
          field: "overtimeHours",
        },
        {
          label: "Paid Leave",
          field: "leaveHours",
        },
        {
          label: "Approved?",
          field: "status",
        },
      ];
      await makeExcel(getTableDataForExport(rows, columns), filename);
    }
  };

  const [filters, setFilters] = React.useState({
    searchTerm: "",
    department: "",
    from: CURRENT_MONTH_START_DATE,
    to: CURRENT_MONTH_END_DATE,
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const mapAttendanceToReport = (attendanceByDate, dateRange) => {
    let absenteesReport = {};

    const attendanceList = [];
    Object.keys(attendanceByDate).forEach((date) =>
      attendanceList.push(...attendanceByDate[date])
    );

    attendanceList.forEach(({ employeeId, employeeName, date, remark }) => {
      if (absenteesReport[employeeId]) {
        absenteesReport[employeeId] = {
          employeeId,
          employeeName,
          [remark]: 1,
          absent: dateRange,
        };
      } else {
        absenteesReport = {
          [employeeId]: {
            ...absenteesReport[employeeId],
            employeeName,
            [remark]: absenteesReport[employeeId][remark] + 1,
            absent: dateRange - absenteesReport[employeeId][remark] + 1,
          },
        };
      }
    });

    return Object.values(absenteesReport);
  };

  const handleSubmit = React.useCallback(async () => {
    await fetchAttendance(filters.from, filters.to);
    const dateRange =
      (new Date(filters.to).getTime() - new Date(filters.from).getTime()) /
      (3600000 * 24);
    const absenteesReport = mapAttendanceToReport(
      state.attendanceByDate,
      dateRange
    );
    setReportData(absenteesReport);
  }, [filters.from, filters.to, state.attendanceByDate]);

  React.useEffect(() => {
    window.addEventListener("keypress", async (e) => {
      if (e.keyCode === 13) {
        await handleSubmit();
      }
    });
  }, []);

  //   React.useEffect(() => {
  //     // Do something
  //   }, [filters.from, filters.to]);

  return (
    <PageView
      title="Leave balances Report"
      icon={
        <span style={{ verticalAlign: "middle" }}>
          <LeaveBalancesIcon fontSize="medium" />
        </span>
      }
      actions={[
        {
          label: "Export to Excel",
          handler: handleExportClick,
          position: 'right',
          icon: {  node: <ExportIcon /> },
          otherProps: {
            color: "primary",
            variant: "text",
          },
        },
      ]}
    >
      <AbsenteesReportFilterbar
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <Box mt={2} />

      {state.isLoading ? (
        <LoadingComponent />
      ) : state.error ? (
        <ErrorBoxComponent
          error={state.error}
          onRetry={async () => await handleSubmit()}
        />
      ) : (
        reportData && <AbsenteesReportTable data={reportData} />
      )}
    </PageView>
  );
};

export default LeaveBalancesReportView;
