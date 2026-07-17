import React from "react";
import clsx from "clsx";
import {
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  SearchOutlined as SearchIcon,
} from "@mui/icons-material";
import Table from "components/TableComponent";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PositionForm from "./PositionForm";

import { Box, ButtonGroup, Button, TextField, InputAdornment, Dialog, DialogContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledRoot = styled(Box)({});

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: "35ch",
  background: theme.palette.background.paper,
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  backdropFilter: "blur(5px)",
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
    <StyledRoot className={clsx(className)}>
      <Box
        mb={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <StyledTextField
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
      </Box>
      <StyledDialog open={formDialogOpen} onClose={handleDialogClose} fullWidth>
        <DialogContent>
          <PositionForm
            positionId={selectedId}
            positionsMap={positionsMap}
            departments={Object.values(departmentsMap)}
            onCancel={handleDialogClose}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </StyledDialog>

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
            field: "salary",
            label: "Salary",
            renderCell: ({ salary }) => {
              return (
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">
                    {salary
                      .toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })
                      .replace(".00", "")}{" "}
                    ETB
                  </Typography>
                </Box>
              );
            },
          },
          {
            field: "parent",
            label: "Parent",
            renderCell: ({ parent }) => {
              const parentPosition = positionsMap[parent];
              return parentPosition ? parentPosition.title : "N/A";
            },
          },
        ]}
        // eslint-disable-next-line array-callback-return
        data={(positions || []).filter((p) => {
          try {
            const { title, description, department } = p;
            const search = searchTerm.toLowerCase();
            return (
              title.includes(search) ||
              description.includes(search) ||
              (departmentsMap[department] || {}).name.includes(search)
            );
          } catch (error) {
            console.error(error);
          }
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
    </StyledRoot>
  );
};

export default PositionList;
