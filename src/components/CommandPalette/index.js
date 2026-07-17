import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, TextField, List, ListItem, ListItemIcon, ListItemText, Typography, Box, Chip, InputAdornment, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import TimerIcon from "@mui/icons-material/Timer";
import PaymentIcon from "@mui/icons-material/Payment";
import InboxIcon from "@mui/icons-material/Inbox";
import WorkIcon from "@mui/icons-material/Work";
import usePermissions from "features/auth/hooks/usePermissions";
import { PERMISSIONS } from "constants/permissions";
import { searchApi } from "features/platform/api";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    marginTop: "10vh",
  },
}));

const StyledKbd = styled("span")(({ theme }) => ({
  fontSize: "0.7rem",
  padding: "2px 6px",
  borderRadius: 4,
  background: theme.palette.action.hover,
  marginLeft: theme.spacing(1),
}));

const QUICK_NAV = [
  { label: "Dashboard", href: "/app/dashboard", icon: DashboardIcon, permission: null },
  { label: "Employees", href: "/app/employees", icon: GroupIcon, permission: PERMISSIONS.EMPLOYEES_READ },
  { label: "Attendance", href: "/app/attendance", icon: TimerIcon, permission: PERMISSIONS.ATTENDANCE_READ },
  { label: "Leaves", href: "/app/leaves", icon: TimerIcon, permission: PERMISSIONS.LEAVES_READ },
  { label: "Payroll", href: "/app/payroll/list", icon: PaymentIcon, permission: PERMISSIONS.PAYROLL_READ },
  { label: "Approvals", href: "/app/inbox", icon: InboxIcon, anyOf: [
    PERMISSIONS.LEAVES_APPROVE,
    PERMISSIONS.WORKFLOWS_APPROVE,
    PERMISSIONS.ATTENDANCE_APPROVE,
    PERMISSIONS.PAYROLL_APPROVE,
  ] },
  { label: "Recruitment", href: "/app/recruitment", icon: WorkIcon, permission: PERMISSIONS.RECRUITMENT_READ },
];

const TYPE_LABELS = {
  employee: "Employee",
  leave: "Leave",
  job: "Job",
  candidate: "Candidate",
  onboarding: "Onboarding",
};

export default function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const { can, canAny } = usePermissions();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef(null);

  const navItems = QUICK_NAV.filter((item) => {
    if (item.anyOf?.length) return canAny(...item.anyOf);
    if (item.permission) return can(item.permission);
    return true;
  });

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  React.useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return undefined;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchApi.global(query.trim());
        setResults(res?.results || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const go = (href) => {
    onClose();
    navigate(href);
  };

  const filteredNav = navItems.filter((item) =>
    !query.trim() || item.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <TextField
          inputRef={inputRef}
          fullWidth
          placeholder="Search employees, leaves, jobs… or jump to a module"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="caption" color="textSecondary">
          Quick navigation
          <StyledKbd>Esc</StyledKbd>
          close
        </Typography>

        {query.trim().length >= 2 && (
          <>
            <Divider style={{ margin: "12px 0" }} />
            <Typography variant="overline" color="textSecondary">
              Search results {loading ? "…" : `(${results.length})`}
            </Typography>
            <List dense>
              {results.map((r) => (
                <ListItem button key={`${r.type}-${r.id}`} onClick={() => go(r.href)}>
                  <ListItemText primary={r.title} secondary={r.subtitle} />
                  <Chip size="small" label={TYPE_LABELS[r.type] || r.type} />
                </ListItem>
              ))}
              {!loading && results.length === 0 && (
                <Box py={2}>
                  <Typography variant="body2" color="textSecondary" align="center">
                    No results for &ldquo;{query}&rdquo;
                  </Typography>
                </Box>
              )}
            </List>
          </>
        )}

        {(!query.trim() || filteredNav.length > 0) && (
          <>
            <Divider style={{ margin: "12px 0" }} />
            <Typography variant="overline" color="textSecondary">
              Go to
            </Typography>
            <List dense>
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <ListItem button key={item.href} onClick={() => go(item.href)}>
                    <ListItemIcon><Icon fontSize="small" /></ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItem>
                );
              })}
            </List>
          </>
        )}
      </DialogContent>
    </StyledDialog>
  );
}

CommandPalette.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
