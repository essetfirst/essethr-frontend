import React from "react";
import { format, startOfWeek, endOfWeek, addDays } from "date-fns";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  colors,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import {
  AvTimer as PresentIcon,
  Timelapse as LateIcon,
  TimerOff as AbsentIcon,
} from "@mui/icons-material";

import useAttendance from "features/attendance/providers";
import BarGraphComponent from "components/BarGraphComponent";
import { countByRemark } from "utils/attendanceStats";

const DailyAttendanceSummaryByRemark = ({
  totalEmployees,
  dailyAttendanceByRemark,
}) => {
  const attendanceList = Array.isArray(dailyAttendanceByRemark)
    ? dailyAttendanceByRemark
    : [];

  return (
    <Card>
      <CardHeader
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              color="textSecondary"
              variant="h3"
              style={{ fontSize: "1rem", fontFamily: "Poppins, sans-serif" }}
            >
              DAILY ATTENDANCE
            </Typography>
            <Typography
              color="textSecondary"
              variant="h3"
              style={{ fontSize: "1rem", fontFamily: "Poppins, sans-serif" }}
            >
              {format(new Date(), "dd MMM yyyy")}
            </Typography>
          </div>
        }
      />
      <Divider />
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <BarGraphComponent
              height={400}
              labels={["Present", "Late", "Absent"]}
              displayLegend={false}
              bars={[
                {
                  label: "Count",
                  color: colors.teal[500],
                  data: [
                    countByRemark(attendanceList, "present"),
                    countByRemark(attendanceList, "late"),
                    countByRemark(attendanceList, "absent"),
                  ],
                },
              ]}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const WeeklyAttendanceSummaryByRemarkChart = ({
  weeklyAttendanceByRemark = {},
}) => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const labels = weekDays.map((d) => format(d, "EEE"));
  const dateKeys = weekDays.map((d) => format(d, "yyyy-MM-dd"));

  const countForRemark = (dateKey, remark) =>
    countByRemark(weeklyAttendanceByRemark?.[dateKey], remark);

  const presentCount = dateKeys.map((key) => countForRemark(key, "present"));
  const lateCount = dateKeys.map((key) => countForRemark(key, "late"));
  const absentCount = dateKeys.map((key) => countForRemark(key, "absent"));

  return (
    <BarGraphComponent
      height={400}
      labels={labels}
      displayLegend
      bars={[
        { label: "Present", color: colors.teal[400], data: presentCount },
        { label: "Late", color: colors.orange[400], data: lateCount },
        { label: "Absent", color: colors.red[300], data: absentCount },
      ]}
    />
  );
};

const WeeklyAttendanceSummaryByRemark = ({
  remarks,
  weeklyAttendanceByRemark,
  totalEmployees,
}) => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  return (
    <Card style={{ height: "100%" }}>
      <CardHeader
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              color="textSecondary"
              variant="h1"
              style={{ fontSize: "1rem", fontFamily: "Poppins" }}
            >
              WEEKLY ATTENDANCE
            </Typography>
            <Typography
              color="textSecondary"
              variant="h2"
              style={{ fontSize: "1rem", fontFamily: "Poppins" }}
            >
              {format(weekStart, "dd MMM")} - {format(weekEnd, "dd MMM")}
            </Typography>
          </div>
        }
      />
      <Divider />
      <CardContent style={{ padding: "0.5rem" }}>
        <WeeklyAttendanceSummaryByRemarkChart
          weeklyAttendanceByRemark={weeklyAttendanceByRemark}
        />
      </CardContent>
    </Card>
  );
};

const AttendanceSummary = ({ totalEmployees }) => {
  const [currentDate] = React.useState(format(new Date(), "yyyy-MM-dd"));
  const remarks = [
    { label: "Present", icon: PresentIcon, color: colors.green[500] },
    { label: "Late", icon: AbsentIcon, color: colors.orange[500] },
    { label: "Absent", icon: LateIcon, color: colors.red[500] },
  ];

  const { state, fetchAttendance } = useAttendance();
  React.useEffect(() => {
    (async () => await fetchAttendance(null, null, currentDate))();
  }, [currentDate, fetchAttendance]);

  return (
    <Box mb={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6}>
          <DailyAttendanceSummaryByRemark
            remarks={remarks}
            dailyAttendanceByRemark={state.attendanceByDate[currentDate] || []}
            totalEmployees={totalEmployees}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <WeeklyAttendanceSummaryByRemark
            remarks={remarks}
            weeklyAttendanceByRemark={state.attendanceByDate}
            totalEmployees={totalEmployees}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AttendanceSummary;
