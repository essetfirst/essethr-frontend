import React from "react";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  // CardHeader,
  // CardMedia,
  // Divider,
  Grid,
  // IconButton,
  // Link,
  makeStyles,
  Typography,
} from "@material-ui/core";

// import {
//   Edit2 as EditIcon,
//   Delete as DeleteIcon,
//   Phone as PhoneIcon,
//   Mail as EmailIcon,
// } from "react-feather";

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

  const name = `${firstName} ${surName} ${lastName}`;
  const avatar = "https://material-ui.com/static/images/avatar/1.jpg";
  // const initials = `${firstName[0]}${surName[0]}${lastName[0]}`;

  return (
    <Card className={classes.root}>
      <Box m={1} p={1} display="flex" justifyContent="center">
        <Avatar
          style={{ width: "128px", height: "128px", borderRadius: "5px" }}
          src={avatar}
        />
      </Box>
      {/* <CardMedia className={classes.cover} image={avatar} title={name} /> */}
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
          </Grid>
          <Grid item xs>
            <Typography variant="h6" gutterBottom>
              <strong>Work phone: </strong>
              {phone}
            </Typography>
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

// const EmployeeCard = ({ employee, onEdit, onDelete }) => {
//   const {
//     firstName,
//     surName,
//     lastName,
//     departmentDetails,
//     positionDetails,
//     phone,
//     email,
//   } = employee;
//   const name = `${firstName} ${lastName}`;
//   const initials = `${firstName[0]}${lastName[0]}`;
//   return (
//     <Card style={{ width: "100%" }}>
//       <CardHeader
//         title={
//           <Typography color="primary" variant="h5">
//             {name}
//           </Typography>
//         }
//         action={
//           <>
//             <IconButton onClick={onEdit} aria-label="edit employee">
//               <EditIcon fontSize="small" size="18" />
//             </IconButton>
//             <IconButton onClick={onDelete} aria-label="delete employee">
//               <DeleteIcon fontSize="small" size="18" />
//             </IconButton>
//           </>
//         }
//       />
//       <Divider />
//       <CardContent>
//         <Grid container spacing={2}>
//           <Grid item>
//             {/* Image */}
//             <Avatar style={{ width: "64px", height: "64px" }} title={name}>
//               {initials}
//             </Avatar>
//           </Grid>
//           <Grid item>
//             <Typography varaint="h3" gutterBottom>
//               {`${firstName} ${surName} ${lastName}`.toUpperCase()}
//             </Typography>
//             <Typography varaint="h5" gutterBottom>
//               {positionDetails.title} * {departmentDetails.name}
//             </Typography>
//             <br />
//             <Typography variant="body1">
//               <PhoneIcon
//                 fontSize="small"
//                 size="16"
//                 style={{ marginRight: "5px", verticalAlign: "middle" }}
//               />
//               {phone}
//             </Typography>
//             {email && (
//               <Typography variant="body1">
//                 <EmailIcon
//                   size="16"
//                   style={{ marginRight: "5px", verticalAlign: "middle" }}
//                 />
//                 {email}
//               </Typography>
//             )}
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   );
// };

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
