import { fromNow } from "utils/date";
import React from "react";
import PropTypes from "prop-types";
import { Box, Paper, Typography, Grid, TextField, MenuItem, IconButton, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const StyledColumn = styled(Paper)(({ theme }) => ({
  padding: "12px",
  minHeight: 420,
  background: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f7fa",
  borderRadius: 8,
}));

const StyledCard = styled(Paper)(({ theme }) => ({
  padding: "12px",
  marginBottom: theme.spacing(1),
  cursor: "grab",
  transition: "box-shadow 0.15s",
  "&:hover": { boxShadow: theme.shadows[3] },
}));

const StyledDragging = styled(Paper)({
  opacity: 0.5,
});

const StyledDropTarget = styled(Paper)(({ theme }) => ({
  outline: `2px dashed ${theme.palette.primary.main}`,
}));

function RatingStars({ value = 0, onChange }) {
  return (
    <Box display="flex">
      {[1, 2, 3, 4, 5].map((n) => (
        <IconButton key={n} size="small" onClick={() => onChange(n)}>
          {n <= (value || 0) ? (
            <StarIcon fontSize="small" color="primary" />
          ) : (
            <StarBorderIcon fontSize="small" />
          )}
        </IconButton>
      ))}
    </Box>
  );
}

export default function RecruitmentPipeline({
  stages,
  candidates,
  onMoveStage,
  onRate,
  onEditNotes,
}) {
  const [dragId, setDragId] = React.useState(null);
  const [dropStage, setDropStage] = React.useState(null);

  const byStage = (stage) =>
    candidates.filter((c) => (c.stage || "applied").toLowerCase() === stage);

  const handleDrop = (stage) => {
    if (dragId) onMoveStage(dragId, stage);
    setDragId(null);
    setDropStage(null);
  };

  return (
    <Grid container spacing={2}>
      {stages.map((stage) => {
        const Column = dropStage === stage ? StyledDropTarget : StyledColumn;
        return (
        <Grid item xs={12} sm={6} md key={stage}>
          <Column
            variant="outlined"
            onDragOver={(e) => {
              e.preventDefault();
              setDropStage(stage);
            }}
            onDragLeave={() => setDropStage(null)}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(stage);
            }}
          >
            <Typography variant="subtitle2" gutterBottom style={{ textTransform: "capitalize" }}>
              {stage} ({byStage(stage).length})
            </Typography>
            {byStage(stage).map((c) => {
              const Card = dragId === c._id ? StyledDragging : StyledCard;
              return (
              <Card
                key={c._id}
                elevation={1}
                draggable
                onDragStart={() => setDragId(c._id)}
                onDragEnd={() => setDragId(null)}
              >
                <Box display="flex" alignItems="flex-start">
                  <DragIndicatorIcon fontSize="small" color="disabled" style={{ marginRight: 4 }} />
                  <Box flex={1}>
                    <Typography variant="body2" style={{ fontWeight: 600 }}>
                      {c.name || c.email}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" display="block">
                      {c.email}
                    </Typography>
                    {c.stageHistory?.length > 0 && (
                      <Typography variant="caption" color="textSecondary" display="block">
                        Updated {fromNow(c.stageHistory[c.stageHistory.length - 1]?.at)}
                      </Typography>
                    )}
                    <RatingStars
                      value={c.rating || 0}
                      onChange={(rating) => onRate(c._id, rating)}
                    />
                    <TextField
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Notes…"
                      value={c.notes || ""}
                      onChange={(e) => onEditNotes(c._id, e.target.value)}
                      onBlur={(e) => onEditNotes(c._id, e.target.value, true)}
                      style={{ marginTop: 4 }}
                    />
                    {stage !== stages[stages.length - 1] && (
                      <Chip
                        size="small"
                        label="Move →"
                        clickable
                        style={{ marginTop: 4 }}
                        onClick={() => {
                          const idx = stages.indexOf(stage);
                          if (idx >= 0 && idx < stages.length - 1) {
                            onMoveStage(c._id, stages[idx + 1]);
                          }
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Card>
            );
            })}
          </Column>
        </Grid>
        );
      })}
    </Grid>
  );
}

RecruitmentPipeline.propTypes = {
  stages: PropTypes.array.isRequired,
  candidates: PropTypes.array.isRequired,
  onMoveStage: PropTypes.func.isRequired,
  onRate: PropTypes.func.isRequired,
  onEditNotes: PropTypes.func.isRequired,
};
