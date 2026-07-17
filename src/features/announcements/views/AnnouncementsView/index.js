import React from "react";
import {
  Box, Button, Paper, TextField, Typography, IconButton, Table, TableHead, TableRow, TableCell, TableBody,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useSnackbar } from "notistack";
import PageView from "components/PageView";
import PageSkeleton from "components/PageSkeleton";
import { announcementsApi } from "features/platform/api";

export default function AnnouncementsView() {
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState({ title: "", body: "" });
  const [editingId, setEditingId] = React.useState(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await announcementsApi.list();
      setItems(res?.announcements || []);
    } catch (e) {
      enqueueSnackbar("Failed to load announcements.", { variant: "error" });
    }
    setLoading(false);
  }, [enqueueSnackbar]);

  React.useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setForm({ title: "", body: "" });
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.title?.trim()) {
      enqueueSnackbar("Title is required.", { variant: "warning" });
      return;
    }
    const payload = { title: form.title.trim(), body: form.body?.trim() || "" };
    const res = editingId
      ? await announcementsApi.update(editingId, payload)
      : await announcementsApi.create(payload);
    if (res?.success) {
      enqueueSnackbar(editingId ? "Updated." : "Created.", { variant: "success" });
      resetForm();
      load();
    } else {
      enqueueSnackbar(res?.error || "Save failed.", { variant: "error" });
    }
  };

  const handleEdit = (row) => {
    setEditingId(row._id);
    setForm({ title: row.title || "", body: row.body || "" });
  };

  const handleDelete = async (id) => {
    const res = await announcementsApi.remove(id);
    if (res?.success) {
      enqueueSnackbar("Deleted.", { variant: "success" });
      if (editingId === id) resetForm();
      load();
    }
  };

  return (
    <PageView title="Announcements" icon={<NotificationsIcon fontSize="large" />} backPath="/app/dashboard" breadcrumbs>
      <Paper style={{ padding: 16, marginBottom: 16 }}>
        <Typography variant="subtitle1" gutterBottom>
          {editingId ? "Edit announcement" : "New announcement"}
        </Typography>
        <Box display="flex" flexDirection="column" gridGap={12}>
          <TextField label="Title" size="small" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextField label="Message" size="small" multiline rows={3} value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <Box display="flex" gridGap={8}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              {editingId ? "Update" : "Publish"}
            </Button>
            {editingId && (
              <Button variant="outlined" onClick={resetForm}>Cancel edit</Button>
            )}
          </Box>
        </Box>
      </Paper>

      {loading ? (
        <PageSkeleton showTitle={false} showActions={false} contentRows={5} />
      ) : (
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Published</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">No announcements yet.</TableCell>
                </TableRow>
              ) : (
                items.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{(row.body || "").slice(0, 80)}</TableCell>
                    <TableCell>
                      {row.publishedOn ? new Date(row.publishedOn).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(row)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(row._id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </PageView>
  );
}
