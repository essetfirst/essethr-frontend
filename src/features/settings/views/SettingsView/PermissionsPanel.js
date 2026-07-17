import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  FormGroup,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import useOrg from "features/org/providers";
import usePermissions from "features/auth/hooks/usePermissions";
import API from "api";
import { ALL_PERMISSIONS } from "constants/permissions";

const PermissionsPanel = () => {
  const { org } = useOrg();
  const orgId = org?._id || org?.id;
  const { role, permissions } = usePermissions();
  const { enqueueSnackbar } = useSnackbar();

  const [roles, setRoles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [roleForm, setRoleForm] = React.useState({
    name: "",
    slug: "",
    permissions: [],
  });
  const [assignEmail, setAssignEmail] = React.useState("");
  const [assignRoleId, setAssignRoleId] = React.useState("");
  const [assigning, setAssigning] = React.useState(false);

  const loadRoles = React.useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const res = await API.orgs.roles.get(orgId);
      if (res?.success) setRoles(res.roles || []);
    } catch (e) {
      enqueueSnackbar("Failed to load roles.", { variant: "error" });
    }
    setLoading(false);
  }, [orgId, enqueueSnackbar]);

  React.useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const togglePermission = (perm) => {
    setRoleForm((f) => ({
      ...f,
      permissions: f.permissions.includes(perm)
        ? f.permissions.filter((p) => p !== perm)
        : [...f.permissions, perm],
    }));
  };

  const handleCreateRole = async () => {
    if (!roleForm.name?.trim() || !roleForm.slug?.trim()) {
      enqueueSnackbar("Name and slug are required.", { variant: "warning" });
      return;
    }
    const res = await API.orgs.roles.create(orgId, {
      name: roleForm.name.trim(),
      slug: roleForm.slug.trim(),
      permissions: roleForm.permissions,
    });
    if (res?.success) {
      enqueueSnackbar("Role created.", { variant: "success" });
      setRoleForm({ name: "", slug: "", permissions: [] });
      loadRoles();
    } else {
      enqueueSnackbar(res?.error || "Create failed.", { variant: "error" });
    }
  };

  const handleAssignByEmail = async () => {
    if (!assignEmail?.trim() || !assignRoleId) {
      enqueueSnackbar("Email and role are required.", { variant: "warning" });
      return;
    }
    setAssigning(true);
    try {
      const usersRes = await API.users.getAll({
        query: { email: assignEmail.trim().toLowerCase() },
        limit: 5,
        page: 1,
      });
      const user = (usersRes?.users || []).find(
        (u) => u.email?.toLowerCase() === assignEmail.trim().toLowerCase()
      );
      if (!user?._id) {
        enqueueSnackbar("No user found with that email.", { variant: "warning" });
        setAssigning(false);
        return;
      }
      const res = await API.orgs.roles.assignUser(orgId, assignRoleId, { userId: user._id });
      if (res?.success) {
        enqueueSnackbar(`Role assigned to ${assignEmail}.`, { variant: "success" });
        setAssignEmail("");
      } else {
        enqueueSnackbar(res?.error || "Assign failed.", { variant: "error" });
      }
    } catch (e) {
      enqueueSnackbar("Assign failed.", { variant: "error" });
    }
    setAssigning(false);
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Your role: <Chip size="small" label={role || "—"} color="primary" />
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Effective permissions ({permissions.length})
      </Typography>
      <Box display="flex" flexWrap="wrap" gridGap={8} mb={3}>
        {permissions.map((p) => (
          <Chip key={p} label={p} size="small" variant="outlined" />
        ))}
      </Box>

      <Typography variant="h6" gutterBottom>Organization roles</Typography>
      {loading ? (
        <CircularProgress size={28} />
      ) : (
        <Paper variant="outlined" style={{ marginBottom: 24 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell align="right">Permissions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.slug}</TableCell>
                  <TableCell align="right">{(r.permissions || []).length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Paper style={{ padding: 16, marginBottom: 24 }} variant="outlined">
        <Typography variant="subtitle1" gutterBottom>Create custom role</Typography>
        <Box display="flex" flexWrap="wrap" gridGap={12} mb={2}>
          <TextField label="Name" size="small" value={roleForm.name}
            onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} />
          <TextField label="Slug" size="small" value={roleForm.slug} placeholder="CUSTOM_ROLE"
            onChange={(e) => setRoleForm({ ...roleForm, slug: e.target.value.toUpperCase() })} />
        </Box>
        <FormGroup row style={{ maxHeight: 200, overflow: "auto" }}>
          {ALL_PERMISSIONS.map((perm) => (
            <FormControlLabel
              key={perm}
              control={
                <Checkbox
                  size="small"
                  checked={roleForm.permissions.includes(perm)}
                  onChange={() => togglePermission(perm)}
                />
              }
              label={perm}
            />
          ))}
        </FormGroup>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleCreateRole}>
            Create role
          </Button>
        </Box>
      </Paper>

      <Paper style={{ padding: 16 }} variant="outlined">
        <Typography variant="subtitle1" gutterBottom>Assign role to user</Typography>
        <Box display="flex" flexWrap="wrap" gridGap={12} alignItems="flex-end">
          <TextField label="User email" size="small" value={assignEmail}
            onChange={(e) => setAssignEmail(e.target.value)} style={{ minWidth: 220 }} />
          <TextField select label="Role" size="small" value={assignRoleId}
            onChange={(e) => setAssignRoleId(e.target.value)} style={{ minWidth: 180 }}>
            {roles.map((r) => (
              <MenuItem key={r._id} value={r._id}>{r.name}</MenuItem>
            ))}
          </TextField>
          <Button variant="contained" color="primary" onClick={handleAssignByEmail} disabled={assigning}>
            Assign
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PermissionsPanel;
