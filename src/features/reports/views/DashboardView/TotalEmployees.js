import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Avatar, Box, Card, CardContent, Grid, Typography, colors } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PeopleOutlined as PeopleIcon } from "@mui/icons-material";

const StyledCard = styled(Card)({
  height: "100%",
  boxShadow: "10px 0px 10px 0px rgba(0,0,0,0.05)",
  borderRadius: 10,
});

const StyledAvatar = styled(Avatar)({
  backgroundColor: colors.teal[300],
  height: 56,
  width: 56,
  boxShadow: "10px 10px 10px 10px rgba(0,0,0,0.08)",
  borderRadius: 8,
  color: "#fff",
  fontSize: 30,
});

const StyledDifferenceValue = styled(Typography)({
  fontFamily: "Poppins",
  marginRight: 8,
});

const TotalEmployees = ({
  currentMonthEmployeesCount,
  calculatePercentage,
  className,
  ...rest
}) => {
  return (
    <StyledCard className={clsx(className)} {...rest}>
      <CardContent>
        <Grid container justifyContent="space-between" spacing={3}>
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
            <StyledAvatar>
              <PeopleIcon />
            </StyledAvatar>
          </Grid>
        </Grid>
        <Box mt={2} />
        <Box mt={2} display="flex" alignItems="center">
          <StyledDifferenceValue
            variant="body2"
            style={{ fontFamily: "Poppins" }}
          >
            {calculatePercentage || 0}%
          </StyledDifferenceValue>
          <Typography
            color="textSecondary"
            variant="body2"
            style={{ fontFamily: "Poppins" }}
          >
            of employee are active
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

TotalEmployees.propTypes = {
  className: PropTypes.string,
};

export default TotalEmployees;
