import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";

const useEmployeeCardStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  cover: {},
}));
const CoolEmployeeCard = ({ employee, onEdit, onDelete }) => {
  const classes = useEmployeeCardStyles();
  const {
    firstName,
    surName,
    lastName,
    departmentDetails,
    positionDetails,
    phone,
    email,
  } = employee;

  console.log("deppppppppppppppp",departmentDetails);

  const name = `${firstName} ${surName} ${lastName}`;
  const avatar = "https://icons8.com/icon/GysS4Q3exahA/name";
  return (
    <Card className={classes.root}>
      <Box m={1} p={1} display="flex" justifyContent="center">
        <Avatar
          style={{ width: "128px", height: "128px", borderRadius: "5px" }}
          src={avatar}
        />
      </Box>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h3" gutterBottom>
              {name}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="body1" gutterBottom>
              <strong>Job Title: </strong>
              {positionDetails.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Department: </strong>
              {departmentDetails.name}
            </Typography>
            <Typography variant="h6" gutterBottom>
              <strong>Work phone: </strong>
              {phone}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="h6" gutterBottom>
              <strong>Mobile phone: </strong>
              {"N/A"}
            </Typography>
            <Typography variant="h6" gutterBottom>
              <strong>Email address: </strong>
              {email}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const ResultsGrid = ({
  employees,
  departmentsMap,
  positionsMap,
  onEditClicked,
  onDeleteClicked,
}) => {
  return (
    <Box mt={1} mb={1}>
      <Grid container spacing={2}>
        {employees.map(({ _id, department, position, ...employeeDetails }) => {
          return (
            <Grid key={_id} item xs={12} sms={12} md={12}>
              <CoolEmployeeCard
                employee={{
                  _id,
                  departmentDetails: departmentsMap[department],
                  positionDetails: positionsMap[position],
                  ...employeeDetails,
                }}
                onEdit={() => onEditClicked(_id)}
                onDelete={() => onDeleteClicked(_id)}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ResultsGrid;
