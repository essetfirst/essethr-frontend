import React from "react";

import { Calendar, Views } from "react-big-calendar";

const CalendarPanel = ({ leaves }) => {
  const leavesByDate = {};

  return (
    <div>
      <Calendar />
    </div>
  );
};

export default CalendarPanel;
