import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import moment from "moment";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Camera as ImageUploadIcon } from "@material-ui/icons";
const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 5,
  },
}));

const Profile = ({ className, user, onUploadImage, ...rest }) => {
  const classes = useStyles();
  const handleFileSelection = (e) => {};

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Box alignItems="center" display="flex" flexDirection="column">
          <Avatar
            className={classes.avatar}
            variant="square"
            src={require("../../../assets/images/hope.jpg")}
          />
          <Box mt={2} />
          <Typography color="textPrimary" gutterBottom variant="h3">
            {user.name}
          </Typography>

          <Typography
            className={classes.dateText}
            color="textSecondary"
            variant="body1"
          >
            {`${moment().format("hh:mm A")}`}
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
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
};

export default Profile;
