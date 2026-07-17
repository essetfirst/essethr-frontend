import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { reviewStatusHelp, reviewStatusColor } from "../utils/performanceUtils";

const emptyReview = {
  period: "",
  selfReview: "",
  managerReview: "",
  score: "",
};

export default function ReviewEditDialog({
  open,
  review,
  mode = "hr",
  onClose,
  onSave,
  onSubmit,
  onComplete,
  saving,
}) {
  const [form, setForm] = React.useState(emptyReview);

  React.useEffect(() => {
    if (open && review) {
      setForm({
        period: review.period || "",
        selfReview: review.selfReview || "",
        managerReview: review.managerReview || "",
        score: review.score ?? "",
      });
    }
  }, [open, review]);

  const status = review?.status || "draft";
  const isEmployee = mode === "employee";
  const canEditSelf = status === "draft" && (isEmployee || mode === "hr");
  const canEditManager = mode === "hr" && (status === "submitted" || status === "draft");
  const canSubmit = status === "draft" && (isEmployee || mode === "hr");
  const canComplete = status === "submitted" && mode === "hr";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          Performance review
          <Chip size="small" label={status} color={reviewStatusColor(status)} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" paragraph>
          {reviewStatusHelp(status)}
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Period"
            value={form.period}
            onChange={(e) => setForm({ ...form, period: e.target.value })}
            fullWidth
            size="small"
            disabled={isEmployee || status === "completed"}
          />
          <TextField
            label="Self-review (employee)"
            value={form.selfReview}
            onChange={(e) => setForm({ ...form, selfReview: e.target.value })}
            fullWidth
            size="small"
            multiline
            minRows={3}
            disabled={!canEditSelf}
            placeholder="Employee reflection on achievements, challenges, and goals…"
          />
          {!isEmployee && (
            <>
              <TextField
                label="Manager review"
                value={form.managerReview}
                onChange={(e) => setForm({ ...form, managerReview: e.target.value })}
                fullWidth
                size="small"
                multiline
                minRows={3}
                disabled={!canEditManager || status === "completed"}
                placeholder="Manager feedback and evaluation…"
              />
              <TextField
                label="Score (0–100)"
                type="number"
                value={form.score}
                onChange={(e) => setForm({ ...form, score: e.target.value })}
                fullWidth
                size="small"
                inputProps={{ min: 0, max: 100 }}
                disabled={status === "completed"}
              />
            </>
          )}
          {isEmployee && status !== "draft" && (
            <>
              <TextField
                label="Manager review"
                value={form.managerReview || "—"}
                fullWidth
                size="small"
                multiline
                minRows={3}
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Score"
                value={form.score !== "" && form.score != null ? form.score : "—"}
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
              />
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ flexWrap: "wrap", gap: 1 }}>
        <Button onClick={onClose}>Close</Button>
        {canEditSelf && (
          <Button
            variant="outlined"
            onClick={() => onSave?.({ ...form, score: form.score !== "" ? Number(form.score) : null })}
            disabled={saving}
          >
            Save draft
          </Button>
        )}
        {canSubmit && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => onSubmit?.({ selfReview: form.selfReview })}
            disabled={saving || !String(form.selfReview).trim()}
          >
            Submit for review
          </Button>
        )}
        {canComplete && (
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              onComplete?.({
                managerReview: form.managerReview,
                score: form.score !== "" ? Number(form.score) : null,
              })
            }
            disabled={saving}
          >
            Mark completed
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
