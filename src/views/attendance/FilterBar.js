import React from "react";

// import moment from "moment";

import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { RepeatTwoTone as RefreshIcon } from "@material-ui/icons";

// import { StaticDatePicker } from "@material-ui/pickers";

import {
  Search as SearchIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,

  // RefreshCcw as RefreshIcon,
  // Repeat as RefreshIcon,
} from "react-feather";

// function disableWeekends(date) {
//   // TODO: replace with implementation for your date library
//   // return isWeekend(moment().day(new Date(date).getDay()));
//   const weekday = moment(new Date(date)).format("dddd"); // Monday ... Sunday
//   const isWeekend = weekday === "Sunday" || weekday === "Saturday";

//   return isWeekend;
// }

const FilterBar = ({
  attendanceDate,
  onAttendanceDateChange,
  filters,
  onFilterChange,
  onRefreshClicked,
}) => {
  const handleShifDate = (offset) => () => {
    onAttendanceDateChange(
      new Date(new Date(attendanceDate).getTime() + offset * 24 * 3600000)
        .toISOString()
        .slice(0, 10)
    );
  };
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center" width={450}>
            <Box display="flex" alignItems="center" mr={1} minWidth={250}>
              <TextField
                fullWidth
                name="searchTerm"
                onChange={onFilterChange}
                value={filters.searchTerm}
                placeholder="Search attendance"
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" size="18" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <TextField
              fullWidth
              select
              label="Filter by remark"
              name="remark"
              onChange={onFilterChange}
              value={filters.remark}
              placeholder="Filter by remark"
              variant="outlined"
              size="small"
            >
              {[
                { label: "ALL", value: "all" },
                { label: "Present", value: "present" },
                { label: "Late", value: "late" },
                { label: "Absent", value: "absent" },
              ].map(({ label, value }) => (
                <MenuItem value={value} key={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box display="flex">
            <Box display="flex" alignItems="center" justifyContent="center">
              <IconButton
                onClick={handleShifDate(-1)}
                aria-label="shift to yesterday"
              >
                <PrevIcon fontSize="small" />
              </IconButton>
              <TextField
                type="date"
                label="Attendance Date"
                name="attendanceDate"
                onChange={(e) => {
                  console.log("onDateChange Time value: ", e.target.value);
                  const d = new Date(e.target.value);
                  onAttendanceDateChange(
                    d && !String(d).includes("Invalid date") ? d : new Date()
                  );
                }}
                // value={new Date(attendanceDate).toISOString().slice(0, 10)}
                value={new Date(attendanceDate).toISOString().slice(0, 10)}
                variant="outlined"
                size="small"
              />
              <IconButton
                onClick={handleShifDate(1)}
                aria-label="shift to tomorrow"
              >
                <NextIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Button
                variant="outlined"
                onClick={onRefreshClicked}
                title={"Refresh"}
                size="large"
              >
                <RefreshIcon fontSize="small" />
              </Button>
            </Box>
          </Box>
        </Box>
        <Box></Box>
        {/* <StaticDatePicker
          orientation="landscape"
          openTo="date"
          value={attendanceDate}
          // @ts-expect-error Waiting for making all inner components generics
          shouldDisableDate={disableWeekends}
          onChange={onAttendanceDateChange}
          renderInput={(props) => <TextField {...props} />}
        /> */}
      </CardContent>
    </Card>
  );
};

export default FilterBar;
