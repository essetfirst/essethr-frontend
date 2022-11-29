import React from "react";

import moment from "moment";

import {
  Avatar,
  Box,
  colors,
  Divider,
  Link,
  Typography,
} from "@material-ui/core";

import TableComponent from "../../components/TableComponent";
import getNameColor from "../../utils/getNameColor";

const DEFAULT_TIMESHEETS = [
  {
    avatar: "",
    initials: "AG",
    name: "Abraham Gebrekidan",
    date: new Date(),
    workedHoursHours: [],
    totalWorkedHours: 0,
    overtimeHours: [],
    totalOvertimeHours: 0,

    // checkin: moment(Date.now()).subtract(14, "hours").unix(),
    // workStartTime: new Date().setHours(8, 30),
    // breakStartTime: new Date().setHours(12, 30),
    // breakout: moment(Date.now()).subtract(8, "hours").unix(),
    // breakin: moment(Date.now()).subtract(7, "hours").unix(),
    // breakEndTime: new Date().setHours(14, 0),
    // workEndTime: new Date().setHours(17, 30),
    // checkout: moment(Date.now()).subtract(3, "hours").unix(),
  },
  {
    avatar: "",
    initials: "EH",
    name: "Endalk Hussien",
    date: new Date(),
    workedHoursHours: [],
    totalWorkedHours: 0,
    overtimeHours: [],
    totalOvertimeHours: 0,

    // checkin: moment(Date.now()).subtract(14, "hours").unix(),
    // workStartTime: new Date().setHours(8, 30),
    // breakStartTime: new Date().setHours(12, 30),
    // breakout: moment(Date.now()).subtract(8, "hours").unix(),
    // breakin: moment(Date.now()).subtract(7, "hours").unix(),
    // breakEndTime: new Date().setHours(14, 0),
    // workEndTime: new Date().setHours(17, 30),
    // checkout: moment(Date.now()).subtract(3, "hours").unix(),
  },
];

function getTimeDiffInHM(t1, t2) {
  return moment(t1).diff(t2, "hours");
}

const EmployeeColumn = ({ _id, avatar, initials, name }) => (
  <Box display="flex" p={2}>
    <Avatar
      alt={name}
      variant="square"
      src={avatar}
      style={{
        borderRadius: "5px",
        marginRight: "16px",
        width: "48px",
        height: "48px",
        background: colors.deepPurple[600],
      }}
    >
      {`${initials}`}
    </Avatar>
    <div>
      <Typography variant="h6" component={Link} href={"/app/employees/" + _id}>
        {`${name}`}
      </Typography>
    </div>
  </Box>
);

const getTimeString = function (time) {
  const mTime = moment(time);
  // return new Date(time).toLocaleTimeString();
  return mTime.format("hh:mm P");
  //   return `${mTime.get("hours")}:${mTime.get("minutes")}`;
};

const StandardHoursColumn = ({
  workedHours = [],
  totalWorkedHours = 0,
  checkin,
  workStartTime,
  breakStartTime,
  breakin,
  breakEndTime,
  workEndTime,
  checkout,
}) => {
  const totalWorkTimeInHrs = 0;
  const totalWorkTimeInMins = 0;

  // const totalWorkedHoursText = <Typography></Typography>;
  // const morningWorkedHours = getTimeDiffInHM(
  //   checkin ? checkin : workStartTime,
  //   breakStartTime
  // );
  // const morningWorkTimeRangeString = `${getTimeString(
  //   checkin ? checkin : workStartTime
  // )} - ${getTimeString(breakStartTime)}`;

  // const noonWorkedHours = getTimeDiffInHM(
  //   breakin && breakin < breakEndTime ? breakin : breakEndTime,
  //   checkout && checkout < workEndTime ? checkout : workEndTime
  // );
  // const noonWorkTimeRangeString = `${getTimeString(
  //   breakEndTime
  // )} - ${getTimeString(
  //   checkout && checkout < workEndTime ? checkout : workEndTime
  // )}`;

  // const totalWorkedHours = Date.now();

  return (
    <div>
      <Divider orientation="vertical" />
      <Box display="flex">
        <Box mr={1}>
          <Typography
            variant="h1"
            component="span"
            color="primary"
            mr={1}
          >{`${totalWorkTimeInHrs}`}</Typography>{" "}
          <Typography
            variant="h6"
            component="span"
            color="textSecondary"
            mr={1}
          >
            hrs
          </Typography>
        </Box>
        <Box mr={1}>
          <Typography
            variant="h1"
            component="span"
            color="primary"
            mr={1}
          >{`${totalWorkTimeInMins}`}</Typography>{" "}
          <Typography variant="h6" component="span" color="textSecondary">
            mins
          </Typography>
        </Box>
      </Box>
      {workedHours.map(({ from, to }, index) => (
        <Typography variant="h6" color="textSecondary" key={index}>
          {getTimeString(from)} - {getTimeString(to)}
        </Typography>
      ))}
    </div>
  );
};

const OvertimeHoursColumn = ({
  overtimeHours,
  totalOvertimeHours,
  checkin,
  workStartTime,
  breakStartTime,
  breakout,

  breakEndTime,
  workEndTime,
  checkout,
}) => {
  const totalOvertimeHoursInHrs = 0;
  const totalOvertimeHoursInMins = 0;

  // const earlyOTHours = getTimeDiffInHM(checkin, workStartTime);
  // const earlyOTTimeRangeString = `${new Date(
  //   checkin
  // ).toLocaleTimeString()} - ${new Date(workStartTime).toLocaleTimeString()}`;

  // const breakOTHours = getTimeDiffInHM(
  //   breakStartTime,
  //   breakout || breakEndTime
  // );
  // const breakOTTimeRangeString = `${new Date(
  //   breakStartTime
  // ).toLocaleTimeString()} - ${new Date(breakEndTime).toLocaleTimeString()}`;
  // const lateOTHours = getTimeDiffInHM(checkout, workEndTime);
  // const lateOTTimeRangeString = `${new Date(
  //   workEndTime
  // ).toLocaleTimeString()} - ${new Date(checkout).toLocaleTimeString()}`;

  // const totalOTHours = Date.now();

  return (
    <div>
      <Divider orientation="vertical" />
      <Box display="flex">
        <Box mr={1}>
          <Typography
            variant="h1"
            component="span"
            color="secondary"
            mr={1}
          >{`${totalOvertimeHoursInHrs}`}</Typography>{" "}
          <Typography
            variant="h6"
            component="span"
            color="textSecondary"
            mr={1}
          >
            hrs
          </Typography>
        </Box>
        <Box mr={1}>
          <Typography
            variant="h1"
            component="span"
            color="secondary"
            mr={1}
          >{`${totalOvertimeHoursInMins}`}</Typography>{" "}
          <Typography variant="h6" component="span" color="textSecondary">
            mins
          </Typography>
        </Box>
      </Box>

      {overtimeHours.map(({ from, to }, index) => (
        <Typography variant="h6" color="textSecondary" key={index}>
          {getTimeString(from)} - {getTimeString(to)}
        </Typography>
      ))}

      {/* 
      <Typography variant="body1" color="textSecondary">
        {earlyOTTimeRangeString} = {earlyOTHours}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {breakOTTimeRangeString} = {breakOTHours}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {lateOTTimeRangeString} = {lateOTHours}
      </Typography> 
      */}
    </div>
  );
};

const TimesheetsTable = ({ timesheets = DEFAULT_TIMESHEETS }) => {
  return (
    <TableComponent
      columns={[
        {
          label: "Employee",
          renderCell: EmployeeColumn,
        },
        {
          label: "Standard Worked Hours",
          renderCell: StandardHoursColumn,
        },
        {
          label: "Overtime Worked Hours",
          renderCell: OvertimeHoursColumn,
        },
      ]}
      data={timesheets}
    />
  );
};

export default TimesheetsTable;
