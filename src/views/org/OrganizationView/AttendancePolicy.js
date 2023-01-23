import React from "react";
import useNotificationSnackbar from "../../../providers/notification-snackbar";
import { useSnackbar } from "notistack";
import { Edit as EditIcon } from "react-feather";
import API from "../../../api";
import useOrg from "../../../providers/org";
import moment from "moment";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Checkbox,
} from "@material-ui/core";

const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wendsday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DEFAULT_WORK_DAY_HOURS_FORMAT = {
  workStartTime: "08:30 AM",
  workEndTime: "05:30 PM",
  breakStartTime: "12:00 AM",
  breakEndTime: "02:00 PM",
};

const DEFAULT_ATTENDANCE_POLICY = DAYS_OF_WEEK.map((day) => ({
  [day]:
    day === "saturday"
      ? {
          workDay: true,
          overtimeAllowed: true,
          workHours: Object.assign({}, DEFAULT_WORK_DAY_HOURS_FORMAT, {
            workEndTime: "12:00 AM",
            breakStartTime: "N/A",
            breakEndTime: "N/A",
          }),
        }
      : day === "sunday"
      ? { workDay: false, overtimeAllowed: true, workHours: {} }
      : {
          workDay: true,
          overtimeAllowed: true,
          workHours: DEFAULT_WORK_DAY_HOURS_FORMAT,
        },
}));

const AttendancePolicy = ({
  orgId,
  attendancePolicy = DEFAULT_ATTENDANCE_POLICY,
}) => {
  const { updateOrg } = useOrg();

  const [selectedWeekDay, setSelectedWeekDay] = React.useState("");
  const [policyState, setPolicyState] = React.useState(
    Array.isArray(attendancePolicy)
      ? attendancePolicy.reduce((p, n) => Object.assign({}, p, n), {})
      : attendancePolicy
  );

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "weekDay") {
      setSelectedWeekDay(value);
    } else if (name === "workDay" || name === "overtimeAllowed") {
      setPolicyState({
        ...policyState,
        [selectedWeekDay]: {
          ...policyState[selectedWeekDay],
          [name]: Boolean(checked),
        },
      });
    } else {
      setPolicyState({
        ...policyState,
        [selectedWeekDay]: {
          ...policyState[selectedWeekDay],
          workHours: {
            ...policyState[selectedWeekDay].workHours,
            [name]: value,
          },
        },
      });
    }
  };
  const { notificationSnackbar } = useNotificationSnackbar();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const notify = notificationSnackbar(enqueueSnackbar, closeSnackbar);
  // eslint-disable-next-line no-empty-pattern
  const [] = React.useState(new Date());

  const [editMode, setEditMode] = React.useState(false);

  const handleEditClick = () => {
    setEditMode(true);
  };
  const handleSaveChanges = () => {
    handleUpdateAttendancePolicy();
    setEditMode(false);
  };
  const handleCancelChanges = () => {
    setEditMode(false);
  };

  const handleUpdateAttendancePolicy = () => {
    API.orgs
      .updateAttendancePolicy(orgId, policyState)
      .then(({ success, message, error }) => {
        if (success) {
          setEditMode(false);
          updateOrg({ attendancePolicy: policyState });

          notify({
            message: message,
            success: true,
            variant: "success",
          });
        } else {
          notify({
            message: error,
            success: false,
            variant: "error",
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div>
      {/* Define work days */}
      <Card>
        <CardHeader
          title="Define work days, and hours"
          action={
            !editMode && (
              <Button
                aria-label="edit work days, hours"
                onClick={handleEditClick}
                variant="outlined"
                startIcon={<EditIcon size={18} />}
              >
                {" Update The Work time "}
              </Button>
            )
          }
        />
        <Divider />
        <CardContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12}>
                <TextField
                  fullWidth
                  select
                  label="Choose Week Day"
                  name="weekDay"
                  onChange={handleChange}
                  value={selectedWeekDay}
                  variant="outlined"
                  margin="dense"
                  size="small"
                >
                  {Object.keys(policyState).map((value) => {
                    let text = value;
                    if (String(value).length === 1) {
                      text = DAYS_OF_WEEK[value];
                    }
                    const label = text.charAt(0).toUpperCase() + text.slice(1);
                    return (
                      <MenuItem value={value} key={value}>
                        {label}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>

              {selectedWeekDay && (
                <Grid item xs={12} sm={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="workDay"
                        checked={policyState[selectedWeekDay].workDay}
                        onChange={editMode ? handleChange : null}
                      />
                    }
                    label="Work day"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="overtimeAllowed"
                        checked={policyState[selectedWeekDay].overtimeAllowed}
                        onChange={editMode ? handleChange : null}
                      />
                    }
                    label="Overtime allowed"
                  />
                </Grid>
              )}
            </Grid>
          </Box>

          <Box mt={2}>
            {selectedWeekDay && (
              <WorkDayHoursForm
                {...policyState[selectedWeekDay].workHours}
                onChange={editMode ? handleChange : null}
              />
            )}
          </Box>
        </CardContent>
        {editMode && (
          <>
            <Divider />
            <Box p={1} display="flex" justifyContent="flex-end">
              <CardActions>
                <ButtonGroup>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    disabled={!selectedWeekDay}
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCancelChanges}
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
              </CardActions>
            </Box>
          </>
        )}
      </Card>
    </div>
  );
};

const WorkDayHoursForm = ({
  onChange,
  workStartTime,
  workEndTime,
  breakStartTime,
  breakEndTime,
}) => {
  const editable = onChange && typeof onChange === "function";

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={6}>
        <TextField
          fullWidth
          label="Work start time"
          name="workStartTime"
          type={editable ? "time" : "text"}
          value={
            editable
              ? workStartTime
              : moment(workStartTime, "HH:mm").format("hh:mm A")
          }
          onChange={onChange}
          variant="outlined"
          margin="dense"
          size="small"
          disabled={editable ? false : true}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <TextField
          fullWidth
          label="Work end time"
          name="workEndTime"
          type={editable ? "time" : "text"}
          value={
            editable
              ? workEndTime
              : moment(workEndTime, "HH:mm").format("hh:mm A")
          }
          onChange={onChange}
          variant="outlined"
          margin="dense"
          size="small"
          disabled={editable ? false : true}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <TextField
          fullWidth
          label="Break start time"
          name="breakStartTime"
          type={editable ? "time" : "text"}
          value={
            editable
              ? breakStartTime
              : moment(breakStartTime, "HH:mm").format("hh:mm A")
          }
          onChange={onChange}
          variant="outlined"
          margin="dense"
          size="small"
          disabled={editable ? false : true}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <TextField
          fullWidth
          label="Break end time"
          name="breakEndTime"
          type={editable ? "time" : "text"}
          value={
            editable
              ? breakEndTime
              : moment(breakEndTime, "HH:mm").format("hh:mm A")
          }
          onChange={onChange}
          variant="outlined"
          margin="dense"
          size="small"
          disabled={editable ? false : true}
        />
      </Grid>
    </Grid>
  );
};

export default AttendancePolicy;
