import React from "react";

// import moment from "moment";

import {
  // Avatar,
  // Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  colors,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  // List,
  // ListItem,
  // ListItemText,
  // Tooltip,
  Typography,
} from "@material-ui/core";

// import { AvatarGroup } from "@material-ui/lab";

import {
  ArrowDropDown as ArrowDropDownIcon,
  AvTimer as PresentIcon,
  Timelapse as LateIcon,
  TimerOff as AbsentIcon,
} from "@material-ui/icons";

import useAttendance from "../../providers/attendance";

import BarGraphComponent from "../../components/BarGraphComponent";
import PieChartComponent from "../../components/PieChartComponent";
// import CardWithTitle from "../../components/CardWithTitle";
// import CustomAvatar from "../../components/CustomAvatar";

import Chart from "react-apexcharts";

const DailyAttendanceSummaryByRemarChart = ({ attendanceByRemark = [] }) => {
  return (
    <PieChartComponent
      pies={attendanceByRemark.map(({ value, ...rest }) => ({
        datum: value,
        ...rest,
      }))}
      height={200}
      displayLegend={false}
    />
  );
};

const DailyAttendanceSummaryByRemarkList = ({ attendanceByRemark = [] }) => {
  return (
    <Box mt={2}>
      <List>
        {attendanceByRemark.map(({ color, icon: Icon, title, value }) => (
          // <Box
          //   display="flex"
          //   alignItems="center"
          //   key={title}
          //   p={1}
          // >
          // <ListItem>
          <ListItem key={title} divider>
            <ListItemIcon style={{ color }}>
              <Icon size={18} />
            </ListItemIcon>
            {/* <ListItemText primary={`${title} (${value})`} color={color} /> */}
            <Typography variant="body2">{title}</Typography>
            <Box flex={1} />
            <Typography variant="h5">{value}</Typography>

            {/* </ListItem> */}
            {/* <Typography color="textPrimary" variant="h6">
              <span style={{ color }}>
                <Icon color={color} />
              </span>{" "}
              {title}
            </Typography>{" "}
            <Typography style={{ color }} variant="h6">
              {Math.round((value / totalEmployees) * 100)}%
            </Typography> */}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const DailyAttendanceSummaryByRemark = ({
  date,
  remarks,
  dailyAttendanceByRemark = {},
}) => {
  console.log(
    "[DailyAttendanceSummaryByRemark]: Line 104 -> dailyAttendanceByRemark: ",
    dailyAttendanceByRemark
  );

  const remarkSeries = remarks.map(({ label, ...rest }) => ({
    title: label,
    value: dailyAttendanceByRemark[String(label).toLowerCase()],
    ...rest,
  }));

  return (
    <Card>
      <CardHeader
        title={
          <Typography color="textSecondary" gutterBottom variant="h6">
            DAILY ATTENDANCE
          </Typography>
        }
        action={
          <Button endIcon={<ArrowDropDownIcon />} size="small" variant="text">
            {date === new Date() ? "Today" : new Date(date).toDateString()}
          </Button>
        }
      />
      <Divider />
      <CardContent>
        <Grid container>
          <Grid item xs={8}>
            <div className="mixed-chart">
              <Chart
                height={300}
                options={{
                  chart: {
                    background: "transparent",
                    stacked: false,
                    toolbar: {
                      show: false,
                    },
                  },
                  // colors: remarkSeries.map(({ color }) => color) || [
                  //   "#688eff",
                  //   "#4CAF50",
                  //   "#FF9800",
                  // ],
                  colors: ["#688eff", "#4CAF50", "#FF9800"],
                  fill: { opacity: 1 },
                  // labels: remarkSeries.map(({ title }) => title) || [
                  //   "On route",
                  //   "Available",
                  //   "Out of service",
                  // ],
                  labels: ["On route", "Available", "Out of service"],
                  plotOptions: {
                    radialBar: {
                      track: { background: "#F9FAFC" },
                    },
                  },
                  theme: { mode: "light" },
                }}
                // series={remarkSeries.map(({ value }) => value) || [38, 50, 12]}
                series={[38, 50, 12]}
                type="radialBar"
                width="100%"
              />
            </div>

            <DailyAttendanceSummaryByRemarChart
              attendanceByRemark={remarkSeries}
            />
          </Grid>
          <Grid item xs={4}>
            <Box p={1}>
              <Typography variant="body2">Total</Typography>
              <Typography variant="h5">100</Typography>
              <Divider />
              {/* <List>
                <ListItem divider disableGutters>
                  <Box
                    style={{
                      border: "3px solid rgb(104, 142, 255)",
                      borderRadius: "50%",
                      height: "16px",
                      marginRight: "8px",
                      width: "16px",
                    }}
                  />
                  <Typography variant="body2">On route</Typography>
                  <Box flex={1} />
                  <Typography variant="h5">36</Typography>
                </ListItem>
              </List> */}
              <DailyAttendanceSummaryByRemarkList
                attendanceByRemark={remarkSeries}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const WeeklyAttendanceSummaryByRemarkChart = ({ weeklyAttendanceByRemark }) => {
  return (
    <BarGraphComponent
      steps={5}
      bars={weeklyAttendanceByRemark}
      height={200}
      labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
      displayLegend={false}
    />
  );
};

// const WeeklyAttendanceSummaryByRemarkFooter = () => {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {(function (offset) {
//         const daysOfWeek = getWeekDates(currentDate, offset);

//         return `${new Date(daysOfWeek[0]).toDateString()} - ${new Date(
//           daysOfWeek[daysOfWeek.length - 2]
//         ).toDateString()}`;
//       })(0)}
//     </Typography>
//   );
// };

const WeeklyAttendanceSummaryByRemark = ({
  remarks,
  weeklyAttendanceByRemark,
}) => {
  console.log(
    "[WeeklyAttendanceSummaryByRemark]: Line 172 -> weeklAttendanceByRemark: ",
    weeklyAttendanceByRemark
  );

  const remarkSeries = remarks.map(({ label, color }) => ({
    label,
    color,
    data: weeklyAttendanceByRemark[String(label).toLowerCase()],
  }));
  return (
    <Card>
      <CardHeader
        title={
          <Typography color="textSecondary" gutterBottom variant="h6">
            WEEKLY ATTENDANCE
          </Typography>
        }
        action={
          <Button endIcon={<ArrowDropDownIcon />} size="small" variant="text">
            Last 7 days
          </Button>
        }
      />

      <Divider />

      <CardContent>
        <WeeklyAttendanceSummaryByRemarkChart
          weeklyAttendanceByRemark={remarkSeries}
        />
        {/* <Box mt={1} />
        <WeeklyAttendanceSummaryByRemarkFooter /> */}
      </CardContent>
    </Card>
  );
};

// const EmployeeAttendanceSummaryByRemark = () => {
//   return (
//     <CardWithTitle title="Attendance Records">
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={12} md={6}>
//           <Box>
//             <Typography variant="h6">Attendance </Typography>
//             <Divider />
//             <AvatarGroup>
//               {[
//                 { name: "Abraham Gebrekidan", late: 3, absent: 0 },
//                 { name: "Endalk Hussien", late: 4 },
//               ].map(({ name, late, avatar }) => (
//                 <Tooltip title={`${name} is late ${late} times`}>
//                   <Badge label={late} variant="standard">
//                     <CustomAvatar alt={name} src={avatar}>
//                       {String(name)
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")}
//                     </CustomAvatar>
//                   </Badge>
//                 </Tooltip>
//               ))}
//             </AvatarGroup>
//           </Box>
//         </Grid>
//       </Grid>
//     </CardWithTitle>
//   );
// };

const AttendanceSummary = ({ totalEmployees = 0 }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date().setDate(27));
  const remarks = [
    {
      label: "Present",
      icon: PresentIcon,
      color: colors.teal[500],
    },
    {
      label: "Late",
      icon: AbsentIcon,
      color: colors.yellow[600],
    },
    {
      label: "Absent",
      icon: LateIcon,
      color: colors.red[500],
    },
  ];
  //   const graphButtonOptions = [
  //     { label: "Last 7 days", value: 1 },
  //     { label: "Current month", value: 2 },
  //     { label: "Previous month", value: 3 },
  //     { label: "Current year", value: 4 },
  //   ];

  const { state, fetchAttendance } = useAttendance();

  React.useEffect(() => {
    (async () => await fetchAttendance(null, null, currentDate))();
  }, [currentDate]);

  const getDailyAttendance = (attendanceByDate, date) =>
    attendanceByDate && attendanceByDate !== undefined
      ? attendanceByDate[date] || []
      : [];

  const mapDailyAttendanceToRemarkCount = (dailyAttendance) => {
    const count = dailyAttendance.reduce(
      (prev, a) =>
        a.remark !== undefined && a.remark
          ? Object.assign({}, prev, {
              [a.remark]: prev[a.remark] !== undefined ? prev[a.remark] + 1 : 1,
              absent:
                prev.absent !== undefined ? prev.absent - 1 : totalEmployees,
            })
          : prev,
      {}
    );
    console.log("Map count: ", count);
    return count;
  };

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
        console.log("[AttendanceSummary]: Line 307 -> prev: ", prev);
        return prev;
      }, {});
  };

  return (
    <Box mb={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6}>
          <DailyAttendanceSummaryByRemark
            date={currentDate}
            remarks={remarks}
            dailyAttendanceByRemark={mapDailyAttendanceToRemarkCount(
              getDailyAttendance(state.attendanceByDate, currentDate)
            )}
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

        {/* <Grid item xs={12} sm={12}>
          <EmployeeAttendanceSummaryByRemark />
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default AttendanceSummary;
