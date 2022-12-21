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
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import PhoneIcon from "@material-ui/icons/Phone";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import EmailIcon from "@material-ui/icons/Email";
import EditRoundedIcon from "@material-ui/icons/EditRounded";

const useStyles = makeStyles((theme) => ({
  root: {},
  icon: {
    fontSize: "12px",
    margin: theme.spacing(1),
  },
}));

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
            display: "flex",
            // flexDirection: "row",
            justifyContent: "start",
            webkitBoxPack: "start",
            alignItems: "center",
            webkitBoxAlign: "center",
            position: "relative",
            textDecoration: "none",
            width: "100%",
            boxSizing: "border-box",
            textAlign: "left",
            borderBottom: "1px solid rgb(230, 232, 240)",
            backgroundClip: "padding-box",
            padding: "12px 24px",
          }}
        >
          <ListItemText
            primary={
              <Box style={{ flex: "1 1 0%", marginTop: "0px" }}>
                <Typography variant="subtitle2">{property}</Typography>
                <Typography variant="body2">
                  {propertiesMap[property]}
                </Typography>
              </Box>
            }
            style={{
              flex: "1 1 auto",
              minWidth: "0px",
              display: "flex",
              flexDirection: "column",
              marginTop: "0px",
              marginBottom: "0px",
            }}
          />
        </ListItem>
      ))}
    </List>
  );
};

const GeneralDetails = ({ details }) => {
  const classes = useStyles();
  const handleEditClick = () => {};

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
                  Email: details.email,
                  Gender: details.gender,
                  BirthDate: details.birthDay,
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        {/* Job details section */}
        <Grid item xs={12} sm={12} md={6}>
          <Card>
            <CardHeader
              title={"Job details"}
              actions={
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
                    name="position"
                    value={
                      details.departmentDetails
                        ? details.departmentDetails.name
                        : "N/A"
                    }
                    variant="outlined"
                    margin="dense"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Designation/Position"
                    name="position"
                    value={
                      details.positionDetails
                        ? details.positionDetails.title
                        : "N/A"
                    }
                    variant="outlined"
                    margin="dense"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Salary"
                    name="salary"
                    value={
                      details.position ? details.positionDetails.salary : 0
                    }
                    variant="outlined"
                    margin="dense"
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact details section */}
        <Grid item xs={12} sm={12}>
          <Card>
            <CardHeader
              title={"Contact details"}
              actions={
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
                    value={details.phone}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment>
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Mobile Phone (Optional)"
                    value={details.phone2 ? details.phone2 : "N/A"}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment>
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Email (Optional)"
                    value={details.email}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment>
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Main address "
                    value={details.address}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment>
                          <LocationOnIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Alternative address (Optional)"
                    value={details.address2 ? details.address2 : "N/A"}
                    variant="outlined"
                    margin="dense"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment>
                          <LocationOnIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Contract details section */}
        <Grid item xs={12} sm={12} md={12}>
          <Card>
            <CardHeader
              title={"Contract details"}
              actions={
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
                    value={details.contractType}
                    variant="outlined"
                    margin="dense"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Employment status"
                    value={details.status}
                    variant="outlined"
                    margin="dense"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Hire date"
                    value={details.hireDate}
                    variant="outlined"
                    margin="dense"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contract start date"
                    value={details.startDate}
                    variant="outlined"
                    margin="dense"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    fullWidth
                    label="Contract end date"
                    value={details.endDate}
                    variant="outlined"
                    margin="dense"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={4}></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GeneralDetails;
