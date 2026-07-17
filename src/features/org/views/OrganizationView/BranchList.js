import React from "react";
import PropTypes from "prop-types";

import { useSnackbar } from "notistack";

import { Box, Button, Chip, Dialog, DialogContent, Divider, InputAdornment, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  AddOutlined as AddIcon,
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  SearchOutlined as SearchIcon,
} from "@mui/icons-material";

import API from "api";

import useAuth from "features/auth/providers";
import useOrg from "features/org/providers";
import useBranches from "features/org/hooks/useBranches";
import useNotificationSnackbar from "providers/notification-snackbar";

import FormikFormFields from "components/common/FormikFormFields";
import TableComponent from "components/TableComponent";
import { branchSchema } from "features/org/schemas/formSchemas";
import { branchFormFields } from "./branchFormFields";

const BranchFormDialog = ({
  open,
  onClose,
  branch,
  onCreateBranch,
  onEditBranch,
}) => {
  const dialogTitle = branch ? "Edit branch" : "Create branch";
  const submitFormLabel = branch ? "Update" : "Create";
  const handleSubmit = (values) =>
    branch ? onEditBranch(branch._id, values) : onCreateBranch(values);

  const initialValues = branch || {
    branch: "",
    phone: "",
    address: { city: "" },
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Typography variant="h5" align="center" gutterBottom>
          {dialogTitle}
        </Typography>
        <Divider />
        <Box mt={2} />
        <FormikFormFields
          submitActionButtonLabel={submitFormLabel}
          initialValues={initialValues}
          validationSchema={branchSchema}
          formFields={branchFormFields}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: "35ch",
  background: theme.palette.background.paper,
}));

const formatAddress = (address) => {
  if (!address || typeof address !== "object") return "—";
  return [address.city, address.region].filter(Boolean).join(", ") || "—";
};

const BranchList = () => {
  const { auth } = useAuth();
  const { org, currentOrg, setCurrentOrg } = useOrg();
  const { branches, fetchBranches, companyName, branchLabel } = useBranches();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { notificationSnackbar } = useNotificationSnackbar();
  const notify = notificationSnackbar(enqueueSnackbar, closeSnackbar);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedBranch, setSelectedBranch] = React.useState(null);
  const [formDialogOpen, setFormDialogOpen] = React.useState(false);

  const mainBranchId = React.useMemo(() => {
    const main = branches.find((b) => b.isMainBranch);
    return main?._id || branches[0]?._id;
  }, [branches]);

  const filteredBranches = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return branches;
    return branches.filter((b) =>
      [b.branch, b.name, b.phone, formatAddress(b.address)]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [branches, searchTerm]);

  const handleDialogOpen = (branch = null) => {
    setSelectedBranch(branch);
    setFormDialogOpen(true);
  };
  const handleDialogClose = () => {
    setSelectedBranch(null);
    setFormDialogOpen(false);
  };

  const handleCreateBranch = async (branchInfo) => {
    try {
      const parentOrgId = mainBranchId || currentOrg || org?._id;
      const { success, org: created, error } = await API.orgs.create({
        ...branchInfo,
        parentOrgId,
        branch: branchInfo.branch,
        createdBy: auth?.user?.email,
      });
      if (success) {
        notify({ success, message: "Branch created successfully." });
        await fetchBranches();
        if (created?._id) setCurrentOrg(created._id);
        handleDialogClose();
      } else {
        notify({ success: false, error: error || "Failed to create branch." });
      }
    } catch (e) {
      notify({ success: false, error: e.message || "Failed to create branch." });
    }
  };

  const handleEditBranch = async (branchId, branchUpdate) => {
    try {
      const { success, error } = await API.orgs.editById(branchId, {
        ...branchUpdate,
        updatedBy: auth?.user?.email,
      });
      if (success) {
        notify({ success, message: "Branch updated successfully." });
        await fetchBranches();
        handleDialogClose();
      } else {
        notify({ success: false, error: error || "Failed to update branch." });
      }
    } catch (e) {
      notify({ success: false, error: e.message || "Failed to update branch." });
    }
  };

  const handleDeleteBranch = async (branchId, branchRow) => {
    if (branchRow?.isMainBranch) {
      notify({ success: false, message: "The main branch cannot be deleted." });
      return;
    }
    try {
      const { success, error } = await API.orgs.deleteById(branchId);
      if (success) {
        notify({ success, message: "Branch deleted." });
        if (String(currentOrg) === String(branchId) && mainBranchId) {
          setCurrentOrg(mainBranchId);
        }
        await fetchBranches();
      } else {
        notify({ success: false, error: error || "Failed to delete branch." });
      }
    } catch (e) {
      notify({ success: false, error: e.message || "Failed to delete branch." });
    }
  };

  return (
    <div>
      <Box mb={2}>
        <Typography variant="subtitle2" color="textSecondary">
          Company: {companyName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Branches share the same company but have their own departments, positions, and employees.
          Switch branches from the top bar to work in a specific location.
        </Typography>
      </Box>

      <Box
        mb={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <StyledTextField
          name="q"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search branches"
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

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDialogOpen(null)}
          startIcon={<AddIcon />}
        >
          Add branch
        </Button>
      </Box>

      <BranchFormDialog
        open={formDialogOpen}
        onClose={handleDialogClose}
        branch={selectedBranch}
        onCreateBranch={handleCreateBranch}
        onEditBranch={handleEditBranch}
      />

      <TableComponent
        size="small"
        columns={[
          {
            label: "Branch",
            field: "branch",
            renderCell: (row) => (
              <Box display="flex" alignItems="center">
                <Typography variant="body1">{branchLabel(row._id)}</Typography>
                {row.isMainBranch && (
                  <Chip size="small" label="Main" color="primary" style={{ marginLeft: 8 }} />
                )}
                {String(row._id) === String(currentOrg) && (
                  <Chip size="small" label="Active" style={{ marginLeft: 8 }} />
                )}
              </Box>
            ),
          },
          {
            label: "Employees",
            field: "employees",
            renderCell: ({ employees = [] }) => employees.length,
          },
          { label: "Phone", field: "phone", renderCell: ({ phone }) => phone || "—" },
          {
            label: "Location",
            field: "address",
            renderCell: ({ address }) => formatAddress(address),
          },
        ]}
        data={filteredBranches}
        rowActions={[
          {
            icon: <EditIcon />,
            label: "Edit branch",
            handler: (row) => handleDialogOpen(row),
          },
          {
            icon: <DeleteIcon />,
            label: "Delete branch",
            handler: (row) => handleDeleteBranch(row._id, row),
          },
        ]}
      />
    </div>
  );
};

BranchList.propTypes = {
  branches: PropTypes.array,
};

export default BranchList;
