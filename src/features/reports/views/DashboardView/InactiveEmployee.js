import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Avatar, Card, CardContent, Grid, Typography, colors, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

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
  position: "relative",
  color: "#fff",
  fontSize: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const StyledDifferenceValue = styled(Typography)({
  marginRight: 8,
});

const InactiveEmployee = ({
  totalInactiveEmployees,
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
              INACTIVE EMPLOYEES
            </Typography>
            <Typography
              color="textSecondary"
              variant="h2"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 35 }}
            >
              <span>{totalInactiveEmployees || 0}</span>
            </Typography>
          </Grid>
          <Grid item>
            <StyledAvatar>
              <ErrorOutlineIcon />
            </StyledAvatar>
          </Grid>
        </Grid>
        <Box mt={2} />
        <Box mt={2} display="flex" alignItems="center">
          <StyledDifferenceValue color="textSecondary">
            {calculatePercentage || 0}%
          </StyledDifferenceValue>

          <Typography
            color="textSecondary"
            variant="body2"
            style={{
              fontFamily: "Poppins",
            }}
          >
            <span>Inactive</span> employees
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

InactiveEmployee.propTypes = {
  className: PropTypes.string,
  totalPayroll: PropTypes.number,
};

export default InactiveEmployee;
