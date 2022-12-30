import React from "react";

import PageView from "../../components/PageView";

import AttendancePanel from "./AttendancePanel";
import TimerIcon from "@material-ui/icons/Timer";

const AttendanceView = () => {
  return (
    <PageView
      title="Attendance"
      icon={
        <span style={{ verticalAlign: "middle" }}>
          <TimerIcon fontSize="large" />
        </span>
      }
      backPath="/app/dashboard"
    >
      <AttendancePanel />
    </PageView>
  );
};

export default AttendanceView;
