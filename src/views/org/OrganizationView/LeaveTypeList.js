import React from "react";
import PropTypes from "prop-types";
import TableComponent from "../../../components/TableComponent";
import LeaveTypeForm from "./LeaveTypeForm";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Dialog,
  DialogContent,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";

import {
  CheckCircleRounded,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  SearchOutlined as SearchIcon,
  WarningRounded,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  textField: {
    width: "35ch",
    background: theme.palette.background.paper,
  },
  dialog: {
    backdropFilter: "blur(5px)",
  },
}));

const LeaveTypeList = ({
  leaveTypes,
  onSortParamsChange,
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
    setSelectedId("");
    handleDialogOpen();
  };

  const handleEditClick = (id) => {
    setSelectedId(id);
    handleDialogOpen();
  };

  const handleDeleteClick = (id) => {
    onDeleteLeaveType(id);
    setSelectedId("");
  };

  const handleFormSubmit = (leaveTypeInfo) => {
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
            startIcon={<AddCircleIcon fontSize="small" />}
          >
            Create
          </Button>
        </ButtonGroup>

        <Dialog
          open={formDialogOpen}
          onClose={handleDialogClose}
          fullWidth
          maxWidth="sm"
          className={classes.dialog}
        >
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
              <Chip
                style={{
                  backgroundColor: color,
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  marginRight: "5px",
                }}
              />
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
          },
        ]}
        // eslint-disable-next-line array-callback-return
        data={(leaveTypes || []).filter((lt) => {
          try {
            return (
              lt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              lt.duration.toString().includes(searchTerm)
            );
          } catch (error) {
            // console.log(error);
          }
        })}
        selectionEnabled
        onSortParamsChange={onSortParamsChange}
        rowActions={[
          {
            label: "Edit leave type",
            icon: <EditIcon fontSize="small" color="primary" />,
            handler: ({ _id }) => handleEditClick(_id),
          },
          {
            label: "Delete leave type",
            icon: <DeleteIcon fontSize="small" color="error" />,
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
