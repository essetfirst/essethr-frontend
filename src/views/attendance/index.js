import React from "react";

import PageView from "../../components/PageView";

import AttendancePanel from "./AttendancePanel";
// import TimesheetsPanel from "./TimesheetsPanel";

import { Clock as TimeIcon } from "react-feather";

const AttendanceView = () => {
  return (
    <PageView
      title="Time management"
      icon={
        <span style={{ verticalAlign: "middle" }}>
          <TimeIcon fontSize="large" />
        </span>
      }
    >
      <AttendancePanel />
    </PageView>
  );
};

export default AttendanceView;
