import React from "react";

import clsx from "clsx";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { getEmployee } from "../PayrollListView/data";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));
const EmployeeHoursGrid = ({
  className,
  employeeHours = [
    { employeeId: 1, standard: 34, leave: 12, holiday: 3 },
    { employeeId: 2, standard: 34, leave: 12, holiday: 3 },
  ],
}) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.root, className)}>
      <Grid container spacing={1}>
        {employeeHours.map(({ employeeId, standard, leave, holiday }) => {
          const employee = getEmployee(employeeId);

          return (
            <Grid item>
              <Card>
                <CardHeader
                  avatar={
                    <Avatar
                      aria-label={employee.name}
                      src={employee.avatar}
                      className={classes.avatar}
                    >
                      R
                    </Avatar>
                  }
                  title={employee.name}
                  subheader="September 14, 2016"
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">
                          Worked hours: <strong>{standard}</strong>
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">
                          (Paid) Leave hours: <strong>{leave}</strong>
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">
                          Holiday hours: <strong>{holiday}</strong>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item>
                      <Divider orientation="vertical" />
                    </Grid>
                    <Grid item>
                      <Box display="flex" flexDirection="column" height="100%">
                        <Typography variant="subtitle1">Total</Typography>
                        <Typography varaint="h6">
                          <strong>{standard + leave + holiday} Hrs</strong>
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default EmployeeHoursGrid;
