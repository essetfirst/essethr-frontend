import React from "react";
import { Avatar, Card, CardContent, colors, Grid, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AccessTime as AttendanceIcon } from "@mui/icons-material";

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
  fontFamily: "Poppins",
});

const TotalAttendance = ({ totalAttendance, calculatePercentage }) => {
  return (
    <StyledCard>
      <CardContent>
        <Grid container justifyContent="space-between" spacing={3}>
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h1"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14 }}
            >
              TODAY&apos;S ATTENDED
            </Typography>
            <Typography
              color="textSecondary"
              variant="h2"
              style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 35 }}
            >
              <span> {totalAttendance} </span>
            </Typography>
          </Grid>
          <Grid item>
            <StyledAvatar>
              <AttendanceIcon />
            </StyledAvatar>
          </Grid>
        </Grid>
        <Box mt={2} />
        <Box mt={2} display="flex" alignItems="center">
          <StyledDifferenceValue variant="body2">
            {calculatePercentage ? calculatePercentage : 0}%
          </StyledDifferenceValue>
          <Typography
            color="textSecondary"
            variant="body2"
            style={{ fontFamily: "Poppins" }}
          >
            of employees are present
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default TotalAttendance;
