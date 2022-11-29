import React from "react";
import PropTypes from "prop-types";

import clsx from "clsx";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles,
  // Divider,
} from "@material-ui/core";

import {
  // TimeToLeave as LeaveIcon,
  // ArrowUpward as ArrowUpwardIcon,
  PeopleOutlined as PeopleIcon,
} from "@material-ui/icons";

import useOrg from "../../../providers/org";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: colors.green[600],
    height: 56,
    width: 56,
    borderRadius: 5,
  },
  differenceIcon: {
    color: colors.green[900],
  },
  differenceValue: {
    color: colors.green[900],
    marginRight: theme.spacing(1),
  },
}));

const TotalEmployees = ({
  currentMonthEmployeesCount,
  lastMonthEmployeesCount,
  className,
  ...rest
}) => {
  const classes = useStyles();

  const { org } = useOrg();

  // const newEmployees = (() => {
  //   (org.employees || []).map(
  //     ({ firstName, surName, lastName, image, startDate }) => ({
  //       name: `${firstName} ${surName} ${lastName}`,
  //       avatar: image,
  //       length: getDateDiff(new Date(), startDate),
  //     })
  //   );
  // })();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              TOTAL EMPLOYEES
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {currentMonthEmployeesCount}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar variant="square" className={classes.avatar}>
              <PeopleIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={2} />
        {/* <Divider /> */}
        <Box mt={2} />
        <Grid container spacing={1}>
          {/* <Grid
            item
            component={Box}
            display="flex"
            flexDirection="column"
            width="100%"
            xs
          >
            <Typography
              color="textSecondary"
              align="center"
              gutterBottom
              variant="h6"
            >
              NEW
            </Typography>
            <Typography color="textPrimary" variant="h3" align="center">
              2
            </Typography>
          </Grid>
          <Grid item component={Box} width="100%" xs>
            <Typography
              color="textSecondary"
              align="center"
              gutterBottom
              variant="h6"
            >
              OLD
            </Typography>
            <Typography color="textPrimary" align="center" variant="h3">
              200
            </Typography>
          </Grid> */}
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalEmployees.propTypes = {
  className: PropTypes.string,
};

export default TotalEmployees;
