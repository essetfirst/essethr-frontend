import React from "react";
import clsx from "clsx";
import {
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  SearchOutlined as SearchIcon,
} from "@material-ui/icons";
import AttachMoneyOutlinedIcon from "@material-ui/icons/AttachMoneyOutlined";
import Table from "../../../components/TableComponent";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import PositionForm from "./PositionForm";

import {
  makeStyles,
  Box,
  ButtonGroup,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  Typography,
} from "@material-ui/core";

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
  onSortParamsChange,
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
            startIcon={<AddCircleIcon />}
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
          {
            field: "parent",
            label: "Parent",
            renderCell: ({ parent }) => {
              const parentPosition = positionsMap[parent];
              return parentPosition ? parentPosition.title : "N/A";
            },
          },
          {
            field: "salary",
            label: "Salary",
            renderCell: ({ salary }) => {
              return (
                <Box display="flex" alignItems="center">
                  <AttachMoneyOutlinedIcon fontSize="small" />
                  <Typography variant="body2">{salary.toFixed(2)}</Typography>
                </Box>
              );
            },
          },
        ]}
        data={(positions || []).filter((p) => {
          const { title, description } = p;
          return (
            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        })}
        selectionEnabled
        onSortParamsChange={onSortParamsChange}
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
