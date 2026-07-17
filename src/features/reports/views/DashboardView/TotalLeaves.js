import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Avatar, Box, Card, CardContent, Grid, Typography, colors } from "@mui/material";
import { styled } from "@mui/material/styles";
import { TimeToLeave as LeaveIcon } from "@mui/icons-material";

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
  marginRight: 8,
});

const TotalLeaves = ({ totalLeaves, calculatePercentage, className, ...rest }) => {
  return (
    <StyledCard className={clsx(className)} {...rest}>
      <CardContent>
        <Grid container justifyContent="space-between" spacing={3}>
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h1"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14 }}
            >
              EMPLOYEE ON LEAVE
            </Typography>
            <Typography
              color="textSecondary"
              variant="h2"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 35 }}
            >
              <span>{totalLeaves || 0}</span>
            </Typography>
          </Grid>
          <Grid item>
            <StyledAvatar variant="square">
              <LeaveIcon />
            </StyledAvatar>
          </Grid>
        </Grid>
        <Box mt={2} display="flex" alignItems="center">
          <StyledDifferenceValue color="textSecondary">
            {calculatePercentage}%
          </StyledDifferenceValue>
          <Typography color="textSecondary" variant="caption">
            of total employees on leave
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

TotalLeaves.propTypes = {
  className: PropTypes.string,
};

export default TotalLeaves;
