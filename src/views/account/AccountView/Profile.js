import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import moment from "moment";

import {
  Avatar,
  Box,
  Button,
  Card,
  // CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Camera as ImageUploadIcon } from "@material-ui/icons";
const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 5,
  },
}));

const Profile = ({ className, user, onUploadImage, ...rest }) => {
  const classes = useStyles();
  // const [imageFile, setImageFile] = React.useState("");

  const handleFileSelection = (e) => {};

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Box alignItems="center" display="flex" flexDirection="column">
          <Avatar
            className={classes.avatar}
            variant="square"
            src={user.avatar}
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
        >
          <input
            name="image"
            style={{ display: "none" }}
            type="file"
            accept={["image/png", "image/jpg", "image/svg"]}
            onChange={handleFileSelection}
          />
        </label>
      </CardContent>
      <Divider />
      <Box p={2} display="flex" justifyContent="center" alignItems="center">
        <Button
          variant="contained"
          color="primary"
          component="span"
          startIcon={<ImageUploadIcon fontSize="small" />}
          aria-label="upload image"
        >
          Upload Image
        </Button>

        {/* <input type="file" name="image" hidden onClick={handleFileChange} />
        <Button
          color="primary"
          fullWidth
          variant="text"
          onClick={onUploadImage}
        >
          Upload picture
        </Button> */}
      </Box>
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
};

export default Profile;
