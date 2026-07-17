import React from "react";
import {
  Box, Button, TextField, Typography, IconButton, MenuItem, Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import useOrg from "features/org/providers";
import API from "api";

const FIELD_TYPES = ["text", "number", "date", "select", "boolean"];

const CustomFieldsPanel = () => {
  const { org } = useOrg();
  const orgId = org?.id || org?._id || org?.currentOrg;
  const { enqueueSnackbar } = useSnackbar();
  const [fields, setFields] = React.useState([]);
  const [draft, setDraft] = React.useState({ key: "", label: "", type: "text", section: "employee" });

  React.useEffect(() => {
    if (!orgId) return;
    API.settings.get(orgId).then((res) => {
      if (res?.success) setFields(res.settings?.customFields || []);
    });
  }, [orgId]);

  const addField = () => {
    if (!draft.key?.trim() || !draft.label?.trim()) return;
    setFields([...fields, { ...draft, key: draft.key.trim(), label: draft.label.trim() }]);
    setDraft({ key: "", label: "", type: "text", section: "employee" });
  };

  const save = async () => {
    const res = await API.settings.get(orgId);
    const settings = res?.settings || {};
    const updated = await API.settings.update(orgId, { ...settings, customFields: fields });
    if (updated?.success) enqueueSnackbar("Custom fields saved.", { variant: "success" });
    else enqueueSnackbar(updated?.error || "Save failed.", { variant: "error" });
  };

  return (
    <Box>
      <Typography variant="body2" color="textSecondary" paragraph>
        Define extra metadata fields shown on employee profiles.
      </Typography>
      <Paper style={{ padding: 16, marginBottom: 16 }}>
        <Box display="flex" flexWrap="wrap" gridGap={12} alignItems="flex-end">
          <TextField label="Key" size="small" value={draft.key} onChange={(e) => setDraft({ ...draft, key: e.target.value })} />
          <TextField label="Label" size="small" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
          <TextField select label="Type" size="small" value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}>
            {FIELD_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <Button variant="outlined" onClick={addField}>Add field</Button>
        </Box>
      </Paper>
      {fields.map((f, i) => (
        <Box key={f.key} display="flex" alignItems="center" mb={1}>
          <Typography style={{ flex: 1 }}>{f.label} ({f.key}) — {f.type}</Typography>
          <IconButton size="small" onClick={() => setFields(fields.filter((_, j) => j !== i))}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={save}>Save custom fields</Button>
    </Box>
  );
};

export default CustomFieldsPanel;
