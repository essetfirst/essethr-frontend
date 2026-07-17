import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTheme as useAppTheme } from "providers/theme";
import {
  Menu as MenuIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  PermIdentity as PermIdentityIcon,
  ExitToApp as ExitToAppIcon,
  Search as SearchIcon,
  KeyboardCommandKey as CommandIcon,
} from "@mui/icons-material";
import useAuth from "features/auth/providers";
import useOrg from "features/org/providers";
import useBranches from "features/org/hooks/useBranches";
import NotificationBell from "components/NotificationBell";
import CommandPalette from "components/CommandPalette";
import KeyboardShortcutsHelp from "components/KeyboardShortcutsHelp";
import LocaleSwitcher from "components/LocaleSwitcher";
import useKeyboardShortcuts from "hooks/useKeyboardShortcuts";
import {
  AppBar,
  Avatar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
  MenuItem,
  Menu,
  TextField,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const LogoMark = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: "0.875rem",
  color: "#fff",
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
}));

const SearchTrigger = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: "6px 12px",
  borderRadius: 8,
  cursor: "pointer",
  border: `1px solid ${theme.palette.mode === "light" ? alpha("#0f172a", 0.08) : alpha("#fff", 0.1)}`,
  backgroundColor: theme.palette.mode === "light" ? alpha("#0f172a", 0.02) : alpha("#fff", 0.04),
  color: theme.palette.text.secondary,
  minWidth: 180,
  transition: "border-color 0.15s ease, background-color 0.15s ease",
  "&:hover": {
    borderColor: alpha(theme.palette.primary.main, 0.35),
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

const BRANCH_SWITCH_ROLES = new Set(["ADMIN", "HR_MANAGER"]);

const TopBar = ({
  className,
  onMobileNavOpen,
  setOpenMinimize,
  openMinimize,
  ...rest
}) => {
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useAppTheme();
  const { auth, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);

  useKeyboardShortcuts({
    onOpenCommandPalette: () => setCommandOpen(true),
    onOpenHelp: () => setHelpOpen(true),
  });

  const { currentOrg, setCurrentOrg, org } = useOrg();
  const { branches, branchLabel, companyName } = useBranches();
  const navigate = useNavigate();

  const canSwitchBranch = BRANCH_SWITCH_ROLES.has(auth?.user?.role);
  const activeBranchLabel = branchLabel(currentOrg || org?._id);
  const userInitials = (auth?.user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    setAnchorEl(null);
    logout(() => navigate("/login"));
  };

  return (
    <StyledAppBar className={className} position="fixed" {...rest}>
      <Toolbar sx={{ minHeight: 64, gap: 1 }}>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
            aria-label="Open navigation"
            edge="start"
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Hidden mdDown>
          <IconButton
            color="inherit"
            aria-label="Toggle sidebar"
            edge="start"
            onClick={() => setOpenMinimize(!openMinimize)}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>

        <Box component={RouterLink} to="/app/dashboard" display="flex" alignItems="center" gap={1.25}>
          <LogoMark>E</LogoMark>
          <Hidden smDown>
            <Typography variant="subtitle1" fontWeight={700} color="text.primary">
              EsseHR
            </Typography>
          </Hidden>
        </Box>

        <Box flexGrow={1} />

        <Hidden xsDown>
          <SearchTrigger
            onClick={() => setCommandOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="Open search"
            onKeyDown={(e) => e.key === "Enter" && setCommandOpen(true)}
          >
            <SearchIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              Search
            </Typography>
            <Box flexGrow={1} />
            <CommandIcon sx={{ fontSize: 14, opacity: 0.6 }} />
            <Typography variant="caption" color="text.secondary">
              ⌘K
            </Typography>
          </SearchTrigger>
        </Hidden>

        <Box display="flex" alignItems="center" gap={0.5}>
          <NotificationBell />
          <IconButton color="inherit" aria-label="Toggle theme" onClick={toggleDarkMode}>
            {darkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
          </IconButton>
        </Box>

        <Hidden smDown>
          <Box ml={1}>
            <LocaleSwitcher />
          </Box>
        </Hidden>

        {auth.isAuth && branches.length > 0 && (
          <Hidden smDown>
            <Box ml={1}>
              {canSwitchBranch ? (
                <TextField
                  select
                  label="Branch"
                  value={currentOrg || org?._id || ""}
                  onChange={(e) => setCurrentOrg(e.target.value)}
                  size="small"
                  sx={{ minWidth: 140 }}
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch._id} value={branch._id}>
                      {branch.branch || branch.name}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <Box textAlign="right">
                  <Typography variant="caption" color="text.secondary">
                    {companyName}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {activeBranchLabel}
                  </Typography>
                </Box>
              )}
            </Box>
          </Hidden>
        )}

        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label="Account menu"
          sx={{ ml: 0.5 }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: "0.75rem",
              fontWeight: 600,
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: theme.palette.primary.main,
            }}
          >
            {userInitials}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box px={2} py={1}>
            <Typography variant="subtitle2" fontWeight={600}>
              {auth?.user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {auth?.user?.role}
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("/app/account");
            }}
          >
            <ListItemIcon>
              <PermIdentityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sign out</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>

      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <KeyboardShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </StyledAppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
  setOpenMinimize: PropTypes.func,
  openMinimize: PropTypes.bool,
};

export default TopBar;
