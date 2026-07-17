import { fmtNow } from "utils/date";
import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import { Avatar, Box, Button, Card, CardContent, Divider, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Camera as ImageUploadIcon } from "@mui/icons-material";
import hopeImage from "assets/images/hope.jpg";

const StyledCard = styled(Card)({
  height: "100%",
});

const StyledAvatar = styled(Avatar)({
  height: 100,
  width: 100,
  borderRadius: 5,
});

const Profile = ({ className, user, onUploadImage, ...rest }) => {
  const handleFileSelection = (e) => {};

  return (
    <StyledCard className={clsx(className)} {...rest}>
      <CardContent>
        <Box alignItems="center" display="flex" flexDirection="column">
          <StyledAvatar variant="square" src={hopeImage} />
          <Box mt={2} />
          <Typography color="textPrimary" gutterBottom variant="h3">
            {user.name}
          </Typography>

          <Typography color="textSecondary" variant="body1">
            {`${fmtNow("hh:mm a")}`}
          </Typography>
        </Box>
        <label
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
          }}
        ></label>
      </CardContent>
      <Divider />
      <Box p={6} display="flex" justifyContent="center" alignItems="center">
        <Button
          variant="contained"
          color="primary"
          component="label"
          startIcon={<ImageUploadIcon />}
        >
          Upload Image
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handleFileSelection}
          />
        </Button>
      </Box>
    </StyledCard>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
};

export default Profile;
