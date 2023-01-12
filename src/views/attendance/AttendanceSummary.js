import React from "react";

import moment from "moment";

import {
  Box,
  // Button,
  Card,
  CardContent,
  CardHeader,
  colors,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@material-ui/core";
import {
  AvTimer as PresentIcon,
  Timelapse as LateIcon,
  TimerOff as AbsentIcon,
} from "@material-ui/icons";

import useAttendance from "../../providers/attendance";
import BarGraphComponent from "../../components/BarGraphComponent";
// import PieChartComponent from "../../components/PieChartComponent";

import Chart from "react-apexcharts";

// const DailyAttendanceSummaryByRemarChart = ({ attendanceByRemark = [] }) => {
//   return (
//     <PieChartComponent
//       pies={attendanceByRemark.map(({ value, ...rest }) => ({
//         datum: value,
//         ...rest,
//       }))}
//       height={200}
//       displayLegend={false}
//     />
//   );
// };

const DailyAttendanceSummaryByRemark = ({
  remarks,
  totalEmployees,
  dailyAttendanceByRemark,
}) => {
  const theme = useTheme();
  return (
    <Card>
      <CardHeader
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              color="textSecondary"
              variant="h3"
              style={{
                fontSize: "1rem",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              DAILY ATTENDANCE
            </Typography>
            <Typography
              color="textSecondary"
              variant="h3"
              style={{
                fontSize: "1rem",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {moment(new Date()).format("DD MMM YYYY")}
            </Typography>
          </div>
        }
      />
      <Divider />
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <div className="mixed-chart">
              <Chart
                height={400}
                options={{
                  animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 800,
                    animateGradually: {
                      enabled: true,
                      delay: 150,
                    },
                    dynamicAnimation: {
                      enabled: true,
                      speed: 350,
                    },

                    dropShadow: {
                      enabled: true,
                      top: 1,
                      left: 1,
                      blur: 1,
                    },
                  },

                  chart: {
                    id: "basic-bar",
                    stacked: true,
                    toolbar: {
                      show: true,

                      tools: {
                        download: true,
                        selection: true,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: false,
                      },
                      autoSelected: "zoom",
                      style: {
                        colors: theme.palette.text.secondary,
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "12px",
                      },
                    },
                  },

                  xaxis: {
                    categories: ["Present", "Late", "Absent"],
                    labels: {
                      style: {
                        colors: theme.palette.text.secondary,
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "12px",
                      },
                    },
                  },
                  plotOptions: {
                    bar: {
                      horizontal: false,
                      columnWidth: "55%",
                      endingShape: "rounded",
                    },
                  },

                  fill: {
                    colors: [
                      colors.teal[500],
                      colors.orange[500],
                      colors.red[500],
                    ],
                  },
                  dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                      return val;
                    },
                  },

                  stroke: {
                    show: false,
                    width: 2,
                  },
                  yaxis: {
                    title: {
                      text: "No. of Employees",
                      style: {
                        color: theme.palette.text.secondary,
                        fontFamily: "Poppins, sans-serif",
                      },
                    },
                    labels: {
                      style: {
                        colors: theme.palette.text.secondary,
                        fontFamily: "Poppins, sans-serif",
                      },
                    },
                  },
                  tooltip: {
                    y: {
                      formatter: function (val) {
                        return val;
                      },
                    },
                  },
                  legend: {
                    labels: {
                      colors: theme.palette.text.secondary,
                    },
                  },
                }}
                series={[
                  {
                    name: "count",
                    data: [
                      dailyAttendanceByRemark.filter(
                        (item) => item.remark === "present"
                      ).length || 0,
                      dailyAttendanceByRemark.filter(
                        (item) => item.remark === "late"
                      ).length || 0,
                      totalEmployees -
                        dailyAttendanceByRemark.filter(
                          (item) => item.remark === "present"
                        ).length -
                        dailyAttendanceByRemark.filter(
                          (item) => item.remark === "late"
                        ).length,
                    ],
                  },
                ]}
                type="area"
                width="100%"
              />
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const WeeklyAttendanceSummaryByRemarkChart = ({
  totalEmployees,
  weeklyAttendanceByRemark = [],
}) => {
  const daysOfWeek = Object.keys(weeklyAttendanceByRemark);
  const daysOfWeekInEnglish = daysOfWeek.map((day) =>
    moment(day).format("ddd")
  );

  if (daysOfWeek.length > 7) {
    daysOfWeek.splice(0, daysOfWeek.length - 7);
    daysOfWeekInEnglish.splice(0, daysOfWeekInEnglish.length - 7);
  }

  const presentCount = daysOfWeek.map((day) => {
    const dayAttendance = weeklyAttendanceByRemark[day];
    return (
      dayAttendance?.filter((item) => item.remark === "present").length || 0
    );
  });

  const lateCount = daysOfWeek.map((day) => {
    const dayData = weeklyAttendanceByRemark[day];

    if (!dayData) {
      return 0;
    }

    const lateItems = dayData.filter((item) => item.remark === "late");

    return lateItems.length;
  });

  const absentCount = daysOfWeek.map((day) => {
    const attendance = weeklyAttendanceByRemark[day];
    if (!attendance) {
      return totalEmployees;
    }
    return (
      totalEmployees -
      attendance.filter((item) => item.remark === "present").length -
      attendance.filter((item) => item.remark === "late").length
    );
  });

  return (
    <BarGraphComponent
      step={5}
      height={400}
      labels={daysOfWeekInEnglish}
      displayLegend={true}
      bars={[
        {
          label: "Present",
          color: colors.teal[400],
          data: [...presentCount],
        },
        {
          label: "Late",
          color: colors.orange[400],
          data: [...lateCount],
        },
        {
          label: "Absent",
          color: colors.red[300],
          data: [...absentCount],
        },
      ]}
    />
  );
};

const WeeklyAttendanceSummaryByRemark = ({
  remarks,
  weeklyAttendanceByRemark,
  totalEmployees,
}) => {
  return (
    <Card style={{ height: "100%" }}>
      <CardHeader
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              color="textSecondary"
              variant="h1"
              style={{
                fontSize: "1rem",
                fontFamily: "Poppins",
              }}
            >
              WEEKLY ATTENDANCE
            </Typography>
            <Typography
              color="textSecondary"
              variant="h2"
              style={{
                fontSize: "1rem",
                fontFamily: "Poppins",
              }}
            >
              {moment().startOf("week").format("DD MMM")} -{" "}
              {moment().endOf("week").format("DD MMM")}
            </Typography>
          </div>
        }
      />

      <Divider />

      <CardContent style={{ padding: "0.5rem" }}>
        <WeeklyAttendanceSummaryByRemarkChart
          weeklyAttendanceByRemark={weeklyAttendanceByRemark}
          remarks={remarks}
          totalEmployees={totalEmployees}
        />
      </CardContent>
    </Card>
  );
};

const AttendanceSummary = ({ totalEmployees }) => {
  const [currentDate] = React.useState(moment().format("YYYY-MM-DD"));
  const remarks = [
    {
      label: "Present",
      icon: PresentIcon,
      color: colors.green[500],
    },
    {
      label: "Late",
      icon: AbsentIcon,
      color: colors.orange[500],
    },
    {
      label: "Absent",
      icon: LateIcon,
      color: colors.red[500],
    },
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
