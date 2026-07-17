import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { fmt } from "utils/date";

function displayDate(value) {
  if (!value) return "N/A";
  try {
    return fmt(value, "dd/MM/yyyy");
  } catch {
    return String(value);
  }
}

const PropertyList = ({ propertiesMap }) => {
  return (
    <List
      style={{
        width: "100%",
        listStyle: "none",
        margin: "0px",
        padding: "0px",
        position: "relative",
      }}
    >
      {Object.keys(propertiesMap).map((property) => (
        <ListItem
          key={property}
          style={{
            padding: "4px",
            margin: "3px",
            position: "relative",
            display: "block",
            width: "98%",
          }}
        >
          <ListItemText
            primary={
              <TextField
                fullWidth
                label={property}
                value={propertiesMap[property] ?? "N/A"}
                variant="outlined"
                margin="dense"
                size="small"
                InputProps={{ readOnly: true }}
              />
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

const GeneralDetails = ({ details, onStatusChange, onEdit }) => {
  const handleEditClick = () => {
    onEdit?.();
  };

  const handleStatusChange = (event) => {
    onStatusChange?.(event.target.value);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6}>
          <Card style={{ padding: 0, height: "100%" }}>
            <CardHeader title={"Personal details"} />
            <Divider />
            <CardContent style={{ padding: "0px" }}>
              <PropertyList
                propertiesMap={{
                  Email: details.email || "N/A",
                  Gender: details.gender || "N/A",
                  BirthDate: displayDate(details.birthDay || details.dateOfBirth),
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Card>
            <CardHeader
              title={"Job details"}
              action={
                <IconButton onClick={handleEditClick} aria-label="edit">
                  <EditRoundedIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={details.departmentDetails?.name || "N/A"}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Designation/Position"
                    value={details.positionDetails?.title || "N/A"}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Salary"
                    value={
                      details.positionDetails?.salary != null
                        ? Number(details.positionDetails.salary).toLocaleString()
                        : "0"
                    }
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Card>
            <CardHeader
              title={"Contact details"}
              action={
                <IconButton onClick={handleEditClick} aria-label="edit">
                  <EditRoundedIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Work Phone"
                    value={details.phone || "N/A"}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon style={{ marginRight: "10px" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Mobile Phone (Optional)"
                    value={details.phone2 || "N/A"}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon style={{ marginRight: "10px" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Email (Optional)"
                    value={details.email || "N/A"}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon style={{ marginRight: "10px" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Main address"
                    value={details.address || "N/A"}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon style={{ marginRight: "10px" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Alternative address (Optional)"
                    value={details.address2 || "N/A"}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon style={{ marginRight: "10px" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <Card>
            <CardHeader
              title={"Contract details"}
              action={
                <IconButton onClick={handleEditClick} aria-label="edit">
                  <EditRoundedIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Contract type"
                    value={details.contractType || "N/A"}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    select
                    label="Employment status"
                    value={details.status === "inactive" ? "inactive" : "active"}
                    onChange={handleStatusChange}
                    variant="outlined"
                    margin="dense"
                    size="small"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Hire date"
                    value={displayDate(details.hireDate)}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contract start date"
                    value={displayDate(details.startDate)}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contract end date"
                    value={displayDate(details.endDate)}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeneralDetails;
