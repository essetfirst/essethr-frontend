import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  LinearProgress,
  Box,
  Typography,
} from "@mui/material";

const emptyGoal = {
  title: "",
  description: "",
  target: "",
  dueDate: "",
  progress: 0,
  status: "active",
};

export default function GoalEditDialog({ open, goal, onClose, onSave, saving }) {
  const [form, setForm] = React.useState(emptyGoal);

  React.useEffect(() => {
    if (open && goal) {
      setForm({
        title: goal.title || "",
        description: goal.description || "",
        target: goal.target || "",
        dueDate: goal.dueDate ? String(goal.dueDate).slice(0, 10) : "",
        progress: goal.progress ?? 0,
        status: goal.status === "closed" ? "closed" : "active",
      });
    }
  }, [open, goal]);

  const handleSave = () => onSave?.({ ...form, progress: Number(form.progress) || 0 });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit goal</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            fullWidth
            size="small"
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            fullWidth
            size="small"
            multiline
            minRows={2}
          />
          <TextField
            label="Target"
            value={form.target}
            onChange={(e) => setForm({ ...form, target: e.target.value })}
            fullWidth
            size="small"
            placeholder="e.g. 100%"
          />
          <TextField
            label="Due date"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <Box>
            <Typography variant="body2" gutterBottom>
              Progress: {form.progress}%
            </Typography>
            <TextField
              type="number"
              value={form.progress}
              onChange={(e) => setForm({ ...form, progress: e.target.value })}
              fullWidth
              size="small"
              inputProps={{ min: 0, max: 100 }}
            />
            <LinearProgress
              variant="determinate"
              value={Math.min(100, Math.max(0, Number(form.progress) || 0))}
              sx={{ mt: 1 }}
            />
          </Box>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving || !form.title.trim()}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
