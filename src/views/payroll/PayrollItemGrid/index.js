import React from "react";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { ArrowRightAltOutlined } from "@material-ui/icons";

const PayrollBriefListItem = ({ payrollBrief, onPayrollItemClicked }) => {
    const { payrollTitle, fromDate, toDate, status }
  return (
    <ListItem>
      <Card>
        <CardContent>
      <ListItemText>
          <Typography variant='h4'>{payrollTitle}</Typography>
          <Typography variant='h6' component='span'>{fromDate}</Typography> to <Typography variant='h6' component='span'>{toDate}</Typography> 
          </ListItemText>
      <ListItemSecondaryAction>
        <IconButton onClick={onPayrollItemClicked}>
          <ArrowRightAltOutlined />
        </IconButton>
      </ListItemSecondaryAction>
        </CardContent>
      </Card>
    </ListItem>
  );
};
const PayrollBriefList = ({ payrolls }) => {
  return (
    <List>
      {payrolls.map((payrollBrief, key) => (
        <PayrollBriefListItem payrollBrief={payrollBrief} key={key} />
      ))}
    </List>
  );
};

const PayrollItemsGrid = ({}) => {
  // const payrolls = () => {}
  return (
    <Grid>
      {/* Section title */}
      {/* Payroll List */}
      {/* Section title */}
      {/* Payroll List */}
    </Grid>
  );
};

export default PayrollItemsGrid;
