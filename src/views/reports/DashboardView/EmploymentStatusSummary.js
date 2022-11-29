import React from "react";

// import moment from "moment";

import {
  Avatar,
  // Box,
  Button,
  // Card,
  // Divider,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import CardWithTitle from "../../../components/CardWithTitle";

const EmploymentStatusRow = ({ avatar, title, subtitle, actions = [] }) => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={avatar}></Avatar>
      </ListItemAvatar>
      <ListItemText
        title={
          <>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body1" color="textSecondary">
              {subtitle}
            </Typography>
          </>
        }
      />
      <ListItemSecondaryAction>
        {actions.map(({ label, icon, handler }, index) => (
          <Button
            key={index}
            onClick={handler}
            startIcon={icon}
            aria-label={label}
          >
            {label}
          </Button>
        ))}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const EmploymentStatusList = ({ title, list, emptyListText }) => {
  return (
    <CardWithTitle title={title}>
      {list.length ? (
        list.map((item, index) => <EmploymentStatusRow key={index} {...item} />)
      ) : (
        <Typography color="textSecondary">{emptyListText}</Typography>
      )}
    </CardWithTitle>
  );
};

const EmploymentStatusSummary = ({ employees = [] }) => {
  const recentlyHired = [];
  const onProbation = [];
  const recentlyFired = [];

  employees.forEach(({ avatar, name, employmentStatus, hireDate }) => {
    //   take out the
  });

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={12} md={4}>
        <EmploymentStatusList
          title={"Hired"}
          list={recentlyHired}
          emptyListText={"No employee was hired recently."}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={4}>
        <EmploymentStatusList
          title={"On Probation"}
          list={onProbation}
          emptyListText={"No employee is on probation."}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={4}>
        <EmploymentStatusList
          title={"Released"}
          list={recentlyFired}
          emptyListText={"No employee was released."}
        />
      </Grid>
    </Grid>
  );
};

export default EmploymentStatusSummary;
