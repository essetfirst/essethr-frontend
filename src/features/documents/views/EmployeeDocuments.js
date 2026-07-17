import { fmt } from "utils/date";
import React from "react";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import GetAppIcon from "@mui/icons-material/GetApp";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSnackbar } from "notistack";
import API from "api";
import PermissionGate from "components/PermissionGate";
import { PERMISSIONS } from "constants/permissions";

const CATEGORIES = [
  "contract",
  "certificate",
  "id",
  "resume",
  "policy",
  "signed",
  "other",
];

const EmployeeDocuments = ({ employeeId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [docs, setDocs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    category: "contract",
    expiresOn: "",
    file: null,
  });
  const fileRef = React.useRef();

  const load = React.useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    const res = await API.documents.list({ employeeId });
    if (res?.success) setDocs(res.documents || []);
    setLoading(false);
  }, [employeeId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async () => {
    if (!form.title.trim() || !form.file) {
      enqueueSnackbar("Title and file are required.", { variant: "warning" });
      return;
    }
    const fd = new FormData();
    fd.append("file", form.file);
    fd.append("title", form.title.trim());
    fd.append("category", form.category);
    fd.append("employeeId", employeeId);
    if (form.expiresOn) fd.append("expiresOn", form.expiresOn);

    setUploading(true);
    try {
      const res = await API.documents.upload(fd);
      if (res?.success) {
        enqueueSnackbar("Document uploaded.", { variant: "success" });
        setForm({ title: "", category: "contract", expiresOn: "", file: null });
        load();
      } else {
        enqueueSnackbar(res?.error || "Upload failed.", { variant: "error" });
      }
    } catch (e) {
      enqueueSnackbar("Upload failed.", { variant: "error" });
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    const res = await API.documents.remove(id);
    if (res?.success) {
      enqueueSnackbar("Document deleted.", { variant: "success" });
      load();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box>
      <PermissionGate permission={PERMISSIONS.DOCUMENTS_WRITE}>
        <Box display="flex" flexWrap="wrap" gridGap={12} mb={3} alignItems="flex-end">
          <TextField
            label="Title"
            size="small"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <TextField
            select
            label="Category"
            size="small"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            style={{ minWidth: 140 }}
          >
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Expires"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={form.expiresOn}
            onChange={(e) => setForm((f) => ({ ...f, expiresOn: e.target.value }))}
          />
          <input
            ref={fileRef}
            type="file"
            hidden
            onChange={(e) => setForm((f) => ({ ...f, file: e.target.files?.[0] || null }))}
          />
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => fileRef.current?.click()}
          >
            {form.file ? form.file.name : "Choose file"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={uploading}
          >
            Upload
          </Button>
        </Box>
      </PermissionGate>

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {docs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No documents uploaded.
                </TableCell>
              </TableRow>
            ) : (
              docs.map((doc) => (
                <TableRow key={doc._id}>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{doc.category}</TableCell>
                  <TableCell>v{doc.version}</TableCell>
                  <TableCell>
                    {doc.expiresOn ? fmt(doc.expiresOn, "MMM d, yyyy") : "—"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      href={API.documents.downloadUrl(doc._id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Download"
                    >
                      <GetAppIcon fontSize="small" />
                    </IconButton>
                    <PermissionGate permission={PERMISSIONS.DOCUMENTS_WRITE}>
                      <IconButton size="small" onClick={() => handleDelete(doc._id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </PermissionGate>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default EmployeeDocuments;
