import React from "react";

import PageView from "../../components/PageView";

import AttendancePanel from "./AttendancePanel";
import TimerIcon from "@material-ui/icons/Timer";

const AttendanceView = () => {
  return (
    <PageView
      title="Attendance"
      backPath="/app/dashboard"
      icon={
        <span style={{ verticalAlign: "middle" }}>
          <TimerIcon fontSize="large" />
        </span>
      }
    >
      <AttendancePanel />
    </PageView>
  );
};

export default AttendanceView;
