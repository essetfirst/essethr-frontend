import React from "react";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { performanceApi } from "features/platform/api";
import {
  goalStatusColor,
  reviewStatusColor,
  reviewStatusHelp,
} from "../utils/performanceUtils";
import ReviewEditDialog from "./ReviewEditDialog";

export default function MyPerformancePanel({ onNotify }) {
  const [goals, setGoals] = React.useState([]);
  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [activeReview, setActiveReview] = React.useState(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [gRes, rRes] = await Promise.all([
        performanceApi.goals({}),
        performanceApi.reviews({}),
      ]);
      setGoals(gRes?.goals || []);
      setReviews(rRes?.reviews || []);
    } catch {
      onNotify?.({ error: "Failed to load performance data." });
    }
    setLoading(false);
  }, [onNotify]);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleSaveReview = async (payload) => {
    if (!activeReview) return;
    setSaving(true);
    try {
      const res = await performanceApi.updateReview(activeReview._id, payload);
      if (res?.success) {
        onNotify?.({ success: true, message: "Review saved." });
        setActiveReview(null);
        load();
      } else {
        onNotify?.({ error: res?.error || "Save failed." });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitReview = async (payload) => {
    if (!activeReview) return;
    setSaving(true);
    try {
      const res = await performanceApi.submitReview(activeReview._id, payload);
      if (res?.success) {
        onNotify?.({ success: true, message: res.message || "Review submitted." });
        setActiveReview(null);
        load();
      } else {
        onNotify?.({ error: res?.error || "Submit failed." });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box py={4}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        My goals
      </Typography>
      <Paper variant="outlined" sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {goals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body2" color="textSecondary">
                    No goals assigned yet.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              goals.map((g) => (
                <TableRow key={g._id}>
                  <TableCell>
                    <Typography variant="body2">{g.title}</Typography>
                    {g.description && (
                      <Typography variant="caption" color="textSecondary" display="block">
                        {g.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{g.target || "—"}</TableCell>
                  <TableCell>
                    <Box minWidth={100}>
                      <Typography variant="caption">{g.progress ?? 0}%</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, Math.max(0, Number(g.progress) || 0))}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={g.status || "active"} color={goalStatusColor(g.status)} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Typography variant="subtitle1" gutterBottom>
        My reviews
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        {reviewStatusHelp("draft")}
      </Typography>
      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body2" color="textSecondary">
                    No reviews yet.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{r.period}</TableCell>
                  <TableCell>{r.score ?? "—"}</TableCell>
                  <TableCell>
                    <Chip size="small" label={r.status} color={reviewStatusColor(r.status)} />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => setActiveReview(r)}>
                      {r.status === "draft" ? "Edit / Submit" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <ReviewEditDialog
        open={Boolean(activeReview)}
        review={activeReview}
        mode="employee"
        onClose={() => setActiveReview(null)}
        onSave={handleSaveReview}
        onSubmit={handleSubmitReview}
        saving={saving}
      />
    </Box>
  );
}
