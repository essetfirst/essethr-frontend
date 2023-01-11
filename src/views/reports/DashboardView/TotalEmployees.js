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
import { PeopleOutlined as PeopleIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",

    boxShadow: "10px 0px 10px 0px rgba(0,0,0,0.05)",
    borderRadius: 10,
  },
  avatar: {
    backgroundColor: colors.teal[300],
    height: 56,
    width: 56,

    boxShadow: "10px 10px 10px 10px rgba(0,0,0,0.08)",
    borderRadius: 8,
    position: "relative",
    color: "#fff",
    fontSize: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  differenceIcon: {
    fontFamily: "Poppins",
    fontSize: 14,
  },
  differenceValue: {
    fontFamily: "Poppins",
    marginRight: theme.spacing(1),
  },
}));

const TotalEmployees = ({
  currentMonthEmployeesCount,
  calculatePercentage,
  className,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography
              color="textSecondary"
              variant="h1"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14 }}
              gutterBottom
            >
              ACTIVE EMPLOYEE
            </Typography>
            <Typography
              color="textSecondary"
              variant="h2"
              style={{ fontWeight: 600, fontFamily: "Poppins", fontSize: 35 }}
            >
              <span> {currentMonthEmployeesCount || 0} </span>
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <PeopleIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={2} />
        <Box
          mt={2}
          display="flex"
          justifyContent={"start"}
          alignItems="center"
          flexDirection="row"
        >
          <Typography
            className={classes.differenceValue}
            variant="body2"
            style={{ fontFamily: "Poppins" }}
          >
            {calculatePercentage || 0}%
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
            style={{ fontFamily: "Poppins" }}
          >
            of employee are active
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

TotalEmployees.propTypes = {
  className: PropTypes.string,
};

export default TotalEmployees;
