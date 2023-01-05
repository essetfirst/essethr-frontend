import React from "react";

import moment from "moment";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  colors,
  Divider,
  Grid,
  Typography,
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
  console.log("dailyAttendanceByRemark", dailyAttendanceByRemark);
  return (
    <Card>
      <CardHeader
        title={
          <Typography color="textSecondary" gutterBottom variant="h6">
            DAILY ATTENDANCE
          </Typography>
        }
        action={
          <Button size="small" variant="text">
            {moment().format("DD MMM YYYY")}
          </Button>
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
                  },

                  chart: {
                    id: "basic-bar",

                    stacked: true,
                    toolbar: {
                      show: true,

                      tools: {
                        download: true,
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true,
                      },
                    },

                    zoom: {
                      enabled: true,
                      type: "x",
                      autoScaleYaxis: true,

                      zoomedArea: {
                        fill: {
                          color: "#90CAF9",
                          opacity: 0.4,

                          gradient: {
                            enabled: true,
                            shade: "light",
                            type: "vertical",
                            shadeIntensity: 0.5,
                            gradientToColors: undefined,
                            inverseColors: true,
                            opacityFrom: 1,
                            opacityTo: 1,
                            stops: [0, 50, 100],

                            colorStops: [],
                          },
                        },
                        stroke: {
                          color: "#0D47A1",
                          width: 1,
                          dashArray: 0,
                        },
                      },
                    },
                  },
                  xaxis: {
                    categories: ["Present", "Late", "Absent"],
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
                  },

                  stroke: {
                    show: true,
                    width: 10,
                    colors: ["transparent"],
                  },
                  yaxis: {
                    title: {
                      text: "No. of Employees",
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
                    displayLegend: true,
                    labels: {
                      colors: colors.grey[600],
                      useSeriesColors: false,

                      formatter: function (val) {
                        return val;
                      },
                    },
                  },
                }}
                series={[
                  {
                    name: "Attendance",
                    data: [
                      dailyAttendanceByRemark.filter(
                        (item) => item.remark === "present"
                      ).length || 0,
                      dailyAttendanceByRemark.filter(
                        (item) => item.remark === "late"
                      ).length || 0,

                      //absent count is total count - present count - late count
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

            {/* <DailyAttendanceSummaryByRemarChart
              attendanceByRemark={remarkSeries}
            /> */}
          </Grid>
          <Grid item xs={12}>
            {/* <DailyAttendanceSummaryByRemarkList
              attendanceByRemark={remarkSeries}
            /> */}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const WeeklyAttendanceSummaryByRemarkChart = () => {
  return (
    <BarGraphComponent
      steps={5}
      height={400}
      labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
      displayLegend={true}
      bars={[
        {
          label: "Present",
          color: colors.teal[500],
          data: [10, 20, 30, 40, 50, 60, 70],
        },
        {
          label: "Late",
          color: colors.orange[500],
          data: [30, 40, 50, 60, 70, 80, 90],
        },
        {
          label: "Absent",
          color: colors.red[500],
          data: [90, 80, 70, 60, 50, 40, 30],
        },
      ]}

      // bars={weeklyAttendanceByRemark.map(({ label, color, data }) => ({
      //   label,
      //   color,
      //   data,
      // }))}
    />
  );
};

const WeeklyAttendanceSummaryByRemark = ({
  remarks,
  weeklyAttendanceByRemark,
}) => {
  const remarkSeries = remarks.map(({ label, color }) => ({
    label,
    color,
    data: weeklyAttendanceByRemark[String(label).toLowerCase()],
  }));
  return (
    <Card style={{ height: "100%" }}>
      <CardHeader
        title={
          <Typography color="textSecondary" gutterBottom variant="h6">
            WEEKLY ATTENDANCE
          </Typography>
        }
        action={
          <Button size="small" variant="text">
            Last 7 days
          </Button>
        }
      />

      <Divider />

      <CardContent style={{ height: "100%" }} className="p-0">
        <WeeklyAttendanceSummaryByRemarkChart
          weeklyAttendanceByRemark={remarkSeries}
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

  const mapWeeklyAttendanceToRemarkCount = (weeklyAttendanceByDate) => {
    const defaultWeeklyAttendanceRemarkCount = new Array(6).map((_) => 0);
    const defaultWeeklyAttendanceAbsentCount = new Array(6).map(
      (_) => totalEmployees
    );
    return Object.values(weeklyAttendanceByDate)
      .flat()
      .reduce((prev, a) => {
        const { remark, date } = a;
        if (!remark || !date) return prev;
        const weekDay = new Date(date).getDay() - 1;
        if (prev[remark] !== undefined) {
          prev[remark][weekDay] = prev[remark][weekDay] + 1;
          prev["absent"][weekDay] = prev["absent"][weekDay] - 1;
        } else {
          prev[remark] = defaultWeeklyAttendanceRemarkCount;
          prev["absent"] = defaultWeeklyAttendanceAbsentCount;
          prev[remark][weekDay] = 1;
          prev["absent"][weekDay] = prev["absent"][weekDay] - 1;
        }
        return prev;
      }, {});
  };

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
            weeklyAttendanceByRemark={mapWeeklyAttendanceToRemarkCount(
              state.attendanceByDate
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AttendanceSummary;
