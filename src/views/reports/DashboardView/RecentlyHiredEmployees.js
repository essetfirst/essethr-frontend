import React from "react";
import PropTypes from "prop-types";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { MoreVertical as MoreIcon } from "react-feather";

const RecentlyHiredEmployees = ({ hirees = [] }) => {
  return (
    <Card>
      <CardHeader title={"Recently hired"} />
      <Divider />
      <CardContent>
        {hirees.length > 0 ? (
          <List>
            {hirees.map((hiree, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar src={hiree.avatar} />
                </ListItemAvatar>
                <ListItemText>
                  <Box display="flex" justifyContent="space-between" pr={1}>
                    <Typography variant="h6">{hiree.name}</Typography>
                    <Typography variant="body1" color="textSecondary">
                      {hiree.hireDate}
                    </Typography>
                  </Box>
                </ListItemText>
                <ListItemSecondaryAction>
                  <IconButton aria-label="more">
                    <MoreIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="textSecondary" align="center">
            {"No new hired employees"}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

RecentlyHiredEmployees.propTypes = {
  hirees: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
      department: PropTypes.string,
      hireDate: PropTypes.string.isRequired,
      contract: PropTypes.string,
    })
  ),
};

export default RecentlyHiredEmployees;
