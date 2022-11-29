import React from "react";
import PropTypes from "prop-types";

import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";

import {
  AddOutlined as AddIcon,
  CheckBoxOutlineBlankRounded,
  CheckCircleRounded,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  SearchOutlined as SearchIcon,
  WarningRounded,
} from "@material-ui/icons";

import TableComponent from "../../../components/TableComponent";

import LeaveTypeForm from "./LeaveTypeForm";

const useStyles = makeStyles((theme) => ({
  textField: {
    width: "35ch",
    background: theme.palette.background.paper,
  },
}));

const LeaveTypeList = ({
  leaveTypes,
  leaveTypesMap,
  onAddLeaveType,
  onUpdateLeaveType,
  onDeleteLeaveType,
}) => {
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = React.useState("");
  const handleSearchTermChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const [formDialogOpen, setFormDialogOpen] = React.useState(false);
  const handleDialogOpen = () => setFormDialogOpen(true);
  const handleDialogClose = () => setFormDialogOpen(false);

  const [selectedId, setSelectedId] = React.useState("");

  const handleAddClick = () => {
    handleDialogOpen();
  };

  const handleEditClick = (id) => () => {
    setSelectedId(id);
    handleDialogOpen();
  };

  const handleDeleteClick = (id) => () => {
    onDeleteLeaveType(id);
    setSelectedId("");
  };

  const handleFormSubmit = (leaveTypeInfo) => {
    // console.log("LeaveTypeId: ", selectedId);
    selectedId
      ? onUpdateLeaveType(leaveTypeInfo)
      : onAddLeaveType(leaveTypeInfo);
    handleDialogClose();
  };

  return (
    <div>
      <Box
        mb={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <div>
          <TextField
            className={classes.textField}
            name="searchTerm"
            onChange={handleSearchTermChange}
            value={searchTerm}
            placeholder="Search leave types"
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddClick}
            startIcon={<AddIcon fontSize="small" />}
          >
            Add
          </Button>
        </ButtonGroup>

        <Dialog open={formDialogOpen} onClose={handleDialogClose}>
          <DialogContent>
            <LeaveTypeForm
              leaveType={leaveTypesMap[selectedId]}
              onSubmit={handleFormSubmit}
              onCancel={handleDialogClose}
            />
          </DialogContent>
        </Dialog>
      </Box>

      <TableComponent
        size="small"
        columns={[
          {
            label: "Leave Type",
            field: "name",
            renderCell: ({ name }) => (
              <Typography variant="h6">{name}</Typography>
            ),
          },
          {
            label: "Duration (in days)",
            field: "duration",
          },
          {
            label: "Color ID",
            field: "color",
            renderCell: ({ color }) => (
              <Chip style={{ backgroundColor: color }} />
            ),
          },
          {
            label: "Past dates allowed",
            field: "allowDaysFromPast",
            align: "center",
            renderCell: ({ allowDaysFromPast }) =>
              allowDaysFromPast ? (
                <CheckCircleRounded color="primary" />
              ) : (
                <WarningRounded />
              ),
            // <Checkbox checked={allowDaysFromPast} />
          },
        ]}
        data={(leaveTypes || []).filter((lt) =>
          String(lt.name).includes(searchTerm)
        )}
        rowActions={[
          {
            label: "Edit leave type",
            icon: <EditIcon fontSize="small" />,
            handler: ({ _id }) => handleEditClick(_id),
          },
          {
            label: "Delete leave type",
            icon: <DeleteIcon fontSize="small" />,
            handler: ({ _id }) => handleDeleteClick(_id),
          },
        ]}
      />
    </div>
  );
};

LeaveTypeList.propTypes = {
  leaveTypes: PropTypes.array,
  leaveTypesMap: PropTypes.object,
  onAddLeaveType: PropTypes.func,
  onUpdateLeaveType: PropTypes.func,
  onDeleteLeaveType: PropTypes.func,
};

export default LeaveTypeList;
