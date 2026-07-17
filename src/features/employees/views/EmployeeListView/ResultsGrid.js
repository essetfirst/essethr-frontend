import React from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  height: "100%",
  marginTop: "10px",
  padding: theme.spacing(2),
}));

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
});

const CoolEmployeeCard = ({ employee, onEdit, onDelete }) => {
  const {
    firstName,
    surName,
    departmentDetails,
    positionDetails,
    phone,
    email,
  } = employee;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const name = `${firstName} ${surName}`;
  return (
    <StyledCard>
      <StyledCardContent>
        <Box display="flex" alignItems="flex-start">
          <div style={{ flexGrow: 1 }}>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: 48 * 4.5,
                },
              }}
            >
              <MenuItem onClick={onEdit}>
                <EditIcon style={{ color: "teal", margin: "0 10px" }} />
                Edit
              </MenuItem>
              <MenuItem onClick={onDelete}>
                <DeleteIcon style={{ color: "#cf5345", margin: "0 10px" }} />
                Delete
              </MenuItem>
            </Menu>
          </div>
          <Box>
            <Typography variant="h3" color="textPrimary" mb={2}>
              {name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Department:</strong>{" "}
              {departmentDetails && departmentDetails.name
                ? departmentDetails.name
                : "N/A"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Position:</strong>{" "}
              {positionDetails && positionDetails.title
                ? positionDetails.title
                : "N/A"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Phone:</strong> {phone ? phone : "N/A"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Email:</strong> {email ? email : "N/A"}
            </Typography>
          </Box>
        </Box>
      </StyledCardContent>
    </StyledCard>
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
    <Grid container spacing={3}>
      {employees.map(({ _id, department, position, ...employeeDetails }) => {
        return (
          <Grid key={_id} item xs={12} sms={12} md={4}>
            <CoolEmployeeCard
              key={_id}
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
  );
};

export default ResultsGrid;
