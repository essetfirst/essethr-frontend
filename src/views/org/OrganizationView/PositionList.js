import React from "react";

import clsx from "clsx";
import {
  makeStyles,
  Box,
  ButtonGroup,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
} from "@material-ui/core";

import {
  AddOutlined as AddIcon,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  SearchOutlined as SearchIcon,
} from "@material-ui/icons";

import Table from "../../../components/TableComponent";

import PositionForm from "./PositionForm";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {},
  textField: {
    width: "35ch",
    background: theme.palette.background.paper,
  },
}));

const PositionList = ({
  className,
  departmentsMap,
  positions,
  positionsMap,
  onCreatePosition,
  onUpdatePosition,
  onDeletePosition,
}) => {
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = React.useState("");
  const handleSearchTermChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const [selectedId, setSelectedId] = React.useState("");

  const [formDialogOpen, setFormDialogOpen] = React.useState(false);
  const handleDialogOpen = () => setFormDialogOpen(true);
  const handleDialogClose = () => {
    setFormDialogOpen(false);
    setSelectedId("");
  };

  const handleEditClick = (id) => {
    setSelectedId(id);
    handleDialogOpen();
  };

  const handleDeleteClick = (id) => {
    onDeletePosition(id);
    // setSelectedId("");
  };

  const handleFormSubmit = (data) => {
    selectedId ? onUpdatePosition(data) : onCreatePosition(data);
    handleDialogClose();
  };

  return (
    <div className={clsx(classes.root, className)}>
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
            placeholder="Search positions"
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
            onClick={handleDialogOpen}
            startIcon={<AddIcon />}
          >
            Create
          </Button>
        </ButtonGroup>
        <Dialog open={formDialogOpen} onClose={handleDialogClose}>
          <DialogContent>
            <PositionForm
              positionId={selectedId}
              positionsMap={positionsMap}
              departments={Object.values(departmentsMap)}
              onCancel={handleDialogClose}
              onSubmit={handleFormSubmit}
            />
          </DialogContent>
        </Dialog>
      </Box>

      <Table
        size="small"
        columns={[
          { field: "title", label: "Job Title" },
          { field: "description", label: "Description" },
          {
            field: "department",
            label: "Department",
            renderCell: ({ department }) =>
              `${(departmentsMap[department] || {}).name || "N/A"}`,
          },
          // {
          //   field: "parent",
          //   label: "Parent",
          //   renderCell: ({ parent }) => `${parent || "N/A"}`,
          // },
          {
            field: "salary",
            label: "Salary",
            renderCell: ({ salary }) => `${salary}`,
          },
        ]}
        data={(positions || []).filter((p) =>
          String(p.title).includes(searchTerm)
        )}
        rowActions={[
          {
            label: "Edit position",
            icon: <EditIcon fontSize="small" color="primary" />,
            handler: ({ _id }) => handleEditClick(_id),
          },
          {
            label: "Delete position",
            icon: <DeleteIcon fontSize="small" color="error" />,
            handler: ({ _id }) => handleDeleteClick(_id),
          },
        ]}
      />
    </div>
  );
};

export default PositionList;
