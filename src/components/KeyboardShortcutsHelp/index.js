import React from "react";
import PropTypes from "prop-types";
import {
  Dialog, DialogTitle, DialogContent, Typography, Box, Chip,
} from "@mui/material";
import { SHORTCUTS } from "hooks/useKeyboardShortcuts";

export default function KeyboardShortcutsHelp({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Keyboard shortcuts</DialogTitle>
      <DialogContent>
        {SHORTCUTS.map((s) => (
          <Box key={s.label} display="flex" justifyContent="space-between" alignItems="center" py={1}>
            <Typography variant="body2">{s.label}</Typography>
            <Box display="flex" gridGap={4}>
              {s.keys.map((k) => (
                <Chip key={k} size="small" label={k} variant="outlined" />
              ))}
            </Box>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
}

KeyboardShortcutsHelp.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
