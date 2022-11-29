import React from "react";

import { Box, TextField, Typography } from "@material-ui/core";
import {
  AccessTime as AbsenteesReportIcon,
  CheckCircleOutlineOutlined as CheckIcon,
} from "@material-ui/icons";

import { Download as ExportIcon } from "react-feather";

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

const AbsenteesReportView = () => {
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
          label: "Present",
          field: "present",
        },
        {
          label: "Late",
          field: "late",
        },
        {
          label: "Absent",
          field: "absent",
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

  const mapAttendanceToReport = (attendanceByDate, maxAbsent) => {
    let absenteesReport = {};

    const attendanceList = [];
    Object.keys(attendanceByDate).forEach((date) =>
      attendanceList.push(...attendanceByDate[date])
    );

    attendanceList.forEach(({ employeeId, employeeName, date, remark }) => {
      if (absenteesReport[employeeId] === undefined) {
        absenteesReport[employeeId] = {
          employeeId,
          employeeName,
          present: remark === "present" ? 1 : 0,
          late: remark === "late" ? 1 : 0,
          absent: maxAbsent - 1,
        };
      } else {
        absenteesReport = {
          [employeeId]: {
            ...absenteesReport[employeeId],
            employeeName,
            [remark]: absenteesReport[employeeId][remark] + 1,
            absent: absenteesReport[employeeId].absent - 1,
          },
        };
      }
    });

    // let attendanceReport = {
    //   byDate: {},
    //   byRemark: {},
    //   attendance: {},
    // };

    // attendanceList.forEach(({ employeeId, date, remark }) => {
    //   // By date
    //     if (attendanceReport.byDate[date]) {
    //       attendanceReport.byDate[date] = {
    //         ...attendanceReport.byDate[date],
    //         [remark]:
    //           attendanceReport.byDate[date][remark] !== undefined
    //             ? attendanceReport.byDate[date][remark] + 1
    //             : 1,
    //       };
    //     } else {
    //       attendanceReport.byDate[date] = { [remark]: 1 };
    //     }

    //   // By remark
    //   if (attendanceReport.byRemark[remark]) {
    //     attendanceReport.byRemark[remark] = {
    //       ...attendanceReport.byRemark[remark],
    //       [employeeId]:
    //         attendanceReport.byRemark[remark][employeeId] !== undefined
    //           ? attendanceReport.byRemark[remark][employeeId] + 1
    //           : 1,
    //     };
    //   } else {
    //     attendanceReport.byRemark[remark] = { [employeeId]: 1 };
    //   }

    //   // Employee collected attendance record
    //   attendanceReport.attendance[employeeId] = {
    //     ...(attendanceReport.attendance[employeeId] || {}),
    //     [remark]: parseInt(
    //       attendanceReport.attendance[employeeId] &&
    //         attendanceReport.attendance[employeeId][remark] !== undefined
    //         ? attendanceReport.attendance[employeeId][remark] + 1
    //         : 1
    //     ),
    //     workedHours: parseInt(
    //       attendanceReport.attendance[employeeId] &&
    //         attendanceReport.attendance[employeeId]["workedHours"] !== undefined
    //         ? attendanceReport.attendance[employeeId]["workedHours"]
    //         : 0
    //     ),
    //   };
    // });

    return Object.values(absenteesReport);
  };

  const handleSubmit = (filters, attendanceByDate) => {
    fetchAttendance(
      new Date(filters.from).toISOString().slice(0, 10),
      new Date(filters.to).toISOString().slice(0, 10)
    );
    const dateRange =
      (new Date(filters.to).getTime() - new Date(filters.from).getTime()) /
      (3600000 * 24);
    console.log(
      "[AbsenteesReportView]: Line 272 -> attendanceByDate: ",
      attendanceByDate
    );

    const countWeekends = (from, to) => {
      let weekends = 0;
      for (
        let d = from;
        d <= to;
        d = new Date(new Date(d).getTime() + 24 * 3600000)
      ) {
        if (new Date(d) !== "invalid date" && new Date(d).getDay() === 0)
          weekends++;
      }
      return weekends;
    };

    const weekends = countWeekends(filters.from, filters.to);

    if (attendanceByDate && Object.keys(attendanceByDate).length > 0) {
      const absenteesReport = mapAttendanceToReport(
        attendanceByDate,
        dateRange - weekends
      );
      setReportData(absenteesReport);
    }
  };

  React.useEffect(() => {
    const enterKeyListener = (e) => {
      if (e.keyCode === 13) {
        handleSubmit(filters, state.attendanceByDate);
      }
    };
    window.addEventListener("keypress", enterKeyListener);

    handleSubmit(filters, state.attendanceByDate);

    return () => window.removeEventListener("keypress", enterKeyListener);
  }, []);

  React.useEffect(() => {
    handleSubmit(filters, state.attendanceByDate);
  }, [filters.from, filters.to]);

  //   React.useEffect(() => {
  //     // Do something
  //   }, [filters.from, filters.to]);

  return (
    <PageView
      title="Absentees Report"
      backPath={"/app/reports"}
      icon={
        <span style={{ verticalAlign: "middle" }}>
          <AbsenteesReportIcon fontSize="medium" />
        </span>
      }
      actions={[
        {
          label: "Export to Excel",
          icon: { node: <ExportIcon /> },
          handler: handleExportClick,
          position: "right",
          otherProps: {
            color: "primary",
            variant: "text",
            disabled: !reportData || !reportData.length,
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
        <ErrorBoxComponent error={state.error} onRetry={() => handleSubmit()} />
      ) : (
        reportData && <AbsenteesReportTable data={reportData} />
      )}
    </PageView>
  );
};

export default AbsenteesReportView;
