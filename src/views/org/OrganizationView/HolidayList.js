import React from "react";
import PropTypes from "prop-types";

// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";

import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  InputAdornment,
  makeStyles,
  TextField,
} from "@material-ui/core";

import {
  AddOutlined as AddIcon,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  SearchOutlined as SearchIcon,
} from "@material-ui/icons";

import TableComponent from "../../../components/TableComponent";

import HolidayForm from "./HolidayForm";

// What are the functionalities
// I wanna add a holiday (type recurring, once), fetch holidays, remove holiday
//
// const localizer = momentLocalizer(moment);

const useStyles = makeStyles((theme) => ({
  textField: {
    width: "35ch",
    background: theme.palette.background.paper,
  },
}));

const HolidayList = ({
  holidays,
  holidaysMap,
  onAddHoliday,
  onUpdateHoliday,
  onDeleteHoliday,
}) => {
  const classes = useStyles();
  console.log("[HolidayList]: Line 49 -> holidays: ", holidays);
  const [searchTerm, setSearchTerm] = React.useState("");
  const handleSearchTermChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const [selectedHoliday, setSelectedHoliday] = React.useState(null);

  const [formDialogOpen, setFormDialogOpen] = React.useState(false);
  const handleDialogOpen = () => setFormDialogOpen(true);
  const handleDialogClose = () => setFormDialogOpen(false);

  const handleAddClick = () => {
    handleDialogOpen();
  };

  const handleEditClick = (_id) => () => {
    setSelectedHoliday(_id);
    handleDialogOpen();
  };

  const handleDeleteClick = (_id) => () => {
    onDeleteHoliday(_id);
    setSelectedHoliday("");
  };

  const handleFormSubmit = (holidayInfo) => {
    console.log(
      "[HolidayList]: Line 51 -> Selected holiday: ",
      selectedHoliday
    );
    selectedHoliday ? onUpdateHoliday(holidayInfo) : onAddHoliday(holidayInfo);
    handleDialogClose();
  };

  return (
    <Box>
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
            placeholder="Search holidays"
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
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
            startIcon={<AddIcon />}
          >
            Add
          </Button>
        </ButtonGroup>
        <Dialog open={formDialogOpen} onClose={handleDialogClose}>
          <DialogContent>
            <HolidayForm
              holiday={holidaysMap[selectedHoliday]}
              onCancel={handleDialogClose}
              onSubmit={handleFormSubmit}
            />
          </DialogContent>
        </Dialog>
      </Box>
      <TableComponent
        size="small"
        columns={[
          { label: "Name", field: "name" },
          { label: "Date", field: "date" },
          {
            label: "Half Day?",
            field: "halfDate",
            align: 'center',
            renderCell: ({ halfDay }) => (
              <FormControlLabel control={<Checkbox checked={halfDay} />} />
            ),
          },
          {
            label: "Included in Payroll?",
            field: "inPayroll",
            align: 'center',
            renderCell: ({ inPayroll }) => (
              <FormControlLabel control={<Checkbox checked={inPayroll} />} />
            ),
          },
        ]}
        data={
          holidays
          // (holidays || []).filter((h) =>String(h.name).includes(searchTerm))
        }
        rowActions={[
          {
            label: "Edit Holiday",
            icon: <EditIcon fontSize="small" />,
            handler: ({ _id }) => handleEditClick(_id),
          },
          {
            label: "Remove Holiday",
            icon: <DeleteIcon fontSize="small" />,
            handler: ({ _id }) => handleDeleteClick(_id),
          },
        ]}
      />
    </Box>
  );
};

HolidayList.propTypes = {
  holidays: PropTypes.array,
  holidaysMap: PropTypes.object,
  onAddHoliday: PropTypes.func,
  onUpdateHoliday: PropTypes.func,
  onDeleteHoliday: PropTypes.func,
};

export default HolidayList;
