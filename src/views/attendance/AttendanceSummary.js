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
                  },

                  chart: {
                    id: "basic-bar",
                    stacked: true,
                    toolbar: {
                      show: false,
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
                    width: 4,
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
                      //Presnt Count
                      dailyAttendanceByRemark.filter(
                        (item) => item.remark === "present"
                      ).length || 0,

                      //LATE COUNT
                      dailyAttendanceByRemark.filter(
                        (item) => item.remark === "late"
                      ).length || 0,

                      //ABSENT COUNT = Total Employees - Present Count - Late Count
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
