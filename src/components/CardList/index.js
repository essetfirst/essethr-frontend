import React from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@material-ui/core";
import { KeyboardArrowRight as GoToIcon } from "@material-ui/icons";
import { useNavigate } from "react-router";

const CardList = ({ cards }) => {
  const navigate = useNavigate();
  const handleLinkClick = (link) => () => {
    navigate(link);
  };

  return (
    <List>
      {cards.map(({ icon, title, description, link }, index) => (
        <Box mt={1} mb={1} key={index}>
          <Paper>
            <ListItem>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText
                primary={title}
                primaryTypographyProps={{ variant: "h5", color: "inherit" }}
                secondary={description}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={handleLinkClick(link)} color="inherit">
                  <GoToIcon fontSize="large" size={8} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Paper>
        </Box>
      ))}
    </List>
  );
};

export default CardList;
