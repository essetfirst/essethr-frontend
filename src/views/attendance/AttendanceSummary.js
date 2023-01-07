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
          <Typography
            color="textSecondary"
            style={{
              fontSize: "1rem",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            DAILY ATTENDANCE
          </Typography>
        }
        action={
          <Typography
            color="textSecondary"
            style={{
              fontSize: "1rem",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {moment(new Date()).format("DD MMM YYYY")}
          </Typography>
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

                    zoom: {
                      enabled: true,
                      type: "x",
                      autoScaleYaxis: true,

                      zoomedArea: {
                        fill: {
                          opacity: 0.9,

                          gradient: {
                            enabled: true,
                            shade: "light",
                            type: "vertical",
                            shadeIntensity: 0.5,
                            inverseColors: true,
                            opacityFrom: 1,
                            opacityTo: 1,
                            stops: [0, 50, 100],
                          },
                        },
                        stroke: {
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
                    formatter: function (val) {
                      return val;
                    },
                  },

                  stroke: {
                    show: true,
                    width: 7,
                  },
                  yaxis: {
                    title: {
                      text: "No. of Employees",
                      fontColor: theme.palette.text.secondary,
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
  remarks,
  totalEmployees,
  weeklyAttendanceByRemark = [],
}) => {
  const daysOfWeek = Object.keys(weeklyAttendanceByRemark);
  const daysOfWeekInEnglish = daysOfWeek.map((day) =>
    moment(day).format("ddd")
  );
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
          data: [
            weeklyAttendanceByRemark[daysOfWeek[0]]?.filter(
              (item) => item.remark === "present"
            ).length || 0,
            weeklyAttendanceByRemark[daysOfWeek[1]]?.filter(
              (item) => item.remark === "present"
            ).length || 0,
            weeklyAttendanceByRemark[daysOfWeek[2]]?.filter(
              (item) => item.remark === "present"
            ).length || 0,
            weeklyAttendanceByRemark[daysOfWeek[3]]?.filter(
              (item) => item.remark === "present"
            ).length || 0,
            weeklyAttendanceByRemark[daysOfWeek[4]]?.filter(
              (item) => item.remark === "present"
            ).length || 0,
            weeklyAttendanceByRemark[daysOfWeek[5]]?.filter(
              (item) => item.remark === "present"
            ).length || 0,
            weeklyAttendanceByRemark[daysOfWeek[6]]?.filter(
              (item) => item.remark === "present"
            ).length || 0,
          ],
        },
        {
          label: "Late",
          color: colors.orange[400],
          data: [
            weeklyAttendanceByRemark[daysOfWeek[0]]?.filter(
              (item) => item.remark === "late"
            ).length || 0,
            weeklyAttendanceByRemark[daysOfWeek[1]]?.filter(
              (item) => item.remark === "late"
            ).length || 0,
            weeklyAttendanceByRemark[daysOfWeek[2]]?.filter(
              (item) => item.remark === "late"
            ).length || 0,
            weeklyAttendanceByRemark[daysOfWeek[3]]?.filter(
              (item) => item.remark === "late"
            ).length || 0,
            weeklyAttendanceByRemark[daysOfWeek[4]]?.filter(
              (item) => item.remark === "late"
            ).length || 0,
            weeklyAttendanceByRemark[daysOfWeek[5]]?.filter(
              (item) => item.remark === "late"
            ).length || 0,
            weeklyAttendanceByRemark[daysOfWeek[6]]?.filter(
              (item) => item.remark === "late"
            ).length || 0,
          ],
        },
        {
          label: "Absent",
          color: colors.red[300],
          data: [
            totalEmployees -
              weeklyAttendanceByRemark[daysOfWeek[0]]?.filter(
                (item) => item.remark === "present"
              ).length -
              weeklyAttendanceByRemark[daysOfWeek[0]]?.filter(
                (item) => item.remark === "late"
              ).length || 0,
            totalEmployees -
              weeklyAttendanceByRemark[daysOfWeek[1]]?.filter(
                (item) => item.remark === "present"
              ).length -
              weeklyAttendanceByRemark[daysOfWeek[1]]?.filter(
                (item) => item.remark === "late"
              ).length || 0,
            totalEmployees -
              weeklyAttendanceByRemark[daysOfWeek[2]]?.filter(
                (item) => item.remark === "present"
              ).length -
              weeklyAttendanceByRemark[daysOfWeek[2]]?.filter(
                (item) => item.remark === "late"
              ).length || 0,
            totalEmployees -
              weeklyAttendanceByRemark[daysOfWeek[3]]?.filter(
                (item) => item.remark === "present"
              ).length -
              weeklyAttendanceByRemark[daysOfWeek[3]]?.filter(
                (item) => item.remark === "late"
              ).length || 0,
            totalEmployees -
              weeklyAttendanceByRemark[daysOfWeek[4]]?.filter(
                (item) => item.remark === "present"
              ).length -
              weeklyAttendanceByRemark[daysOfWeek[4]]?.filter(
                (item) => item.remark === "late"
              ).length || 0,
            totalEmployees -
              weeklyAttendanceByRemark[daysOfWeek[5]]?.filter(
                (item) => item.remark === "present"
              ).length -
              weeklyAttendanceByRemark[daysOfWeek[5]]?.filter(
                (item) => item.remark === "late"
              ).length || 0,
            totalEmployees -
              weeklyAttendanceByRemark[daysOfWeek[6]]?.filter(
                (item) => item.remark === "present"
              ).length -
              weeklyAttendanceByRemark[daysOfWeek[6]]?.filter(
                (item) => item.remark === "late"
              ).length || 0,
          ],
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
  const daysOfWeek = Object.keys(weeklyAttendanceByRemark);
  const dataOfweeklyAttendanceByRemark = Object.values(
    weeklyAttendanceByRemark
  );

  moment.locale("en");
  const daysOfWeekInEnglish = daysOfWeek.map((day) => moment(day).format("dd"));

  const data = [];
  for (let i = 0; i < daysOfWeekInEnglish.length; i++) {
    data.push({
      day: daysOfWeekInEnglish[i],
      present: dataOfweeklyAttendanceByRemark[i].filter(
        (item) => item.remark === "present"
      ).length,
      late: dataOfweeklyAttendanceByRemark[i].filter(
        (item) => item.remark === "late"
      ).length,
      absent: dataOfweeklyAttendanceByRemark[i].filter(
        (item) => item.remark === "absent"
      ).length,
    });
  }

  return (
    <Card style={{ height: "100%" }}>
      <CardHeader
        title={
          <Typography
            color="textSecondary"
            variant="h6"
            style={{
              fontSize: "1rem",
              fontFamily: "Poppins",
            }}
          >
            WEEKLY ATTENDANCE
          </Typography>
        }
        action={
          <Typography
            color="textSecondary"
            variant="h6"
            style={{
              fontSize: "1rem",
              fontFamily: "Poppins",
            }}
          >
            {/* use moment to get the current week date range */}
            {moment().startOf("week").format("DD MMM")} -{" "}
            {moment().endOf("week").format("DD MMM")}
          </Typography>
        }
      />

      <Divider />

      <CardContent style={{ height: "100%" }} className="p-0">
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

  // const mapWeeklyAttendanceToRemarkCount = (weeklyAttendanceByDate) => {
  //   const defaultWeeklyAttendanceRemarkCount = new Array(6).map((_) => 0);
  //   const defaultWeeklyAttendanceAbsentCount = new Array(6).map(
  //     (_) => totalEmployees
  //   );
  //   return Object.values(weeklyAttendanceByDate)
  //     .flat()
  //     .reduce((prev, a) => {
  //       const { remark, date } = a;
  //       if (!remark || !date) return prev;
  //       const weekDay = new Date(date).getDay() - 1;
  //       if (prev[remark] !== undefined) {
  //         prev[remark][weekDay] = prev[remark][weekDay] + 1;
  //         prev["absent"][weekDay] = prev["absent"][weekDay] - 1;
  //       } else {
  //         prev[remark] = defaultWeeklyAttendanceRemarkCount;
  //         prev["absent"] = defaultWeeklyAttendanceAbsentCount;
  //         prev[remark][weekDay] = 1;
  //         prev["absent"][weekDay] = prev["absent"][weekDay] - 1;
  //       }
  //       return prev;
  //     }, {});
  // };

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
