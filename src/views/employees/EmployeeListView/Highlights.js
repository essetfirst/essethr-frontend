import React from "react";

import ReactPerfectScrollbar from "react-perfect-scrollbar";

import {
  // Avatar,
  // Box,
  Button,
  // Card,
  // CardContent,
  Chip,
  // Divider,
  Grid,
  // IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";

import CardWithTitle from "../../../components/CardWithTitle";
import CustomAvatar from "../../../components/CustomAvatar";
import { ChevronRight } from "react-feather";

const CustomList = ({ list, renderItem, onListEmptyItem, height }) =>
  list.length ? (
    <List style={{ paddingTop: 0, height, overflowY: "auto" }}>
      <ReactPerfectScrollbar>
        {list.map((item, index) => (
          <ListItem key={index}>{renderItem && renderItem(item)}</ListItem>
        ))}
      </ReactPerfectScrollbar>
    </List>
  ) : (
    <ListItem>{onListEmptyItem}</ListItem>
  );

const NewlyHiredEmployeeList = ({ employees }) => {
  return (
    <CustomList
      height={100}
      list={employees}
      renderItem={({ _id, name, hireDate, department }) => {
        return (
          <>
            <ListItemAvatar>
              <CustomAvatar size="2">A</CustomAvatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <div>
                  <Typography
                    variant="h6"
                    component={Link}
                    href={`/app/employees/${_id}`}
                  >
                    {name}
                  </Typography>
                  <Typography variant="body2">{department}</Typography>
                </div>
              }
              secondary={<Typography variant="body2">on {hireDate}</Typography>}
            />
          </>
        );
      }}
      onListEmptyItem={
        <Typography variant="body2">{"No new hirees."}</Typography>
      }
    />
  );
};
const EmployeeOnProbationList = ({ employees }) => {
  return (
    <CustomList
      height={100}
      list={employees}
      renderItem={({ _id, name, startDate, department }) => {
        const remainingDays = parseInt(
          (Date.now() - new Date(startDate).getTime()) / (24 * 3600000)
        );

        return (
          <>
            <ListItemAvatar>
              <CustomAvatar size="2">A</CustomAvatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <div>
                  <Typography
                    variant="h6"
                    component={Link}
                    href={`/app/employees/${_id}`}
                  >
                    {name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {department}
                  </Typography>
                </div>
              }
              secondary={
                <>
                  <Typography variant="body2">
                    <Chip
                      color={remainingDays <= 10 ? "secondary" : "default"}
                      size="small"
                      variant="outlined"
                      label={`${remainingDays} days remaining`}
                    />
                  </Typography>
                </>
              }
            />
            <ListItemSecondaryAction>
              <Button endIcon={<ChevronRight />}></Button>
            </ListItemSecondaryAction>
          </>
        );
      }}
      onListEmptyItem={
        <Typography variant="body2">'No one is on probation.'</Typography>
      }
    />
  );
};

const ReleasedEmployeeList = ({ employees }) => {
  return (
    <CustomList
      height={100}
      list={employees}
      renderItem={({ _id, name, hireDate, reason, department }) => {
        return (
          <>
            <ListItemAvatar>
              <CustomAvatar alt={name} size="2">
                {String(name)
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </CustomAvatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <div>
                  <Typography
                    variant="h6"
                    component={Link}
                    href={`/app/employees/${_id}`}
                  >
                    {name}
                  </Typography>

                  <Typography variant="body2">
                    <strong>{reason}</strong>
                  </Typography>
                </div>
              }
              secondary={
                <Typography variant="body2">
                  Worked for{" "}
                  {new Date().getFullYear() - new Date(hireDate).getFullYear()}{" "}
                  yrs
                </Typography>
              }
            />
          </>
        );
      }}
      onListEmptyItem={
        <Typography variant="body2">'No one released.'</Typography>
      }
    />
  );
};

const Highlights = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={4}>
        <CardWithTitle title={"  Newly hired"}>
          <NewlyHiredEmployeeList employees={[]} />
        </CardWithTitle>
      </Grid>

      <Grid item xs={12} sm={12} md={4}>
        <CardWithTitle title={"  Employees On Probation"}>
          <EmployeeOnProbationList
            employees={[
              {
                name: "Abraham Gebrekidan",
                startDate: "May 28, 2021",
                department: "Software Engineering",
              },
              {
                name: "Endalk Hussien",
                startDate: "May 25, 2021",
                department: "Software Engineering",
              },
            ]}
          />
        </CardWithTitle>
      </Grid>

      <Grid item xs={12} sm={12} md={4}>
        <CardWithTitle title={"Released Employees"}>
          <ReleasedEmployeeList
            employees={[
              {
                name: "Adane Semahegn",
                hireDate: "May 28, 2021",
                reason: "Not fit",
                department: "Marketing",
              },
              {
                name: "Anteneh Tesfaye",
                hireDate: "May 25, 2021",
                reason: "Another job",
                department: "Software Engineering",
              },
            ]}
          />
        </CardWithTitle>
      </Grid>
    </Grid>
  );
};

export default Highlights;
