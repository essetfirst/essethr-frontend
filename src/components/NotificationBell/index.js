import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  Typography,
  Box,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { notificationsApi } from "features/platform/api";

export default function NotificationBell() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [count, setCount] = React.useState(0);

  const load = React.useCallback(() => {
    notificationsApi.inbox().then((res) => {
      if (res?.success) {
        setItems(res.notifications || []);
        setCount(res.unreadCount || 0);
      }
    });
  }, []);

  React.useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [load]);

  const handleOpen = (n) => {
    if (!n.read) {
      notificationsApi.markRead(n.id).then(() => load());
    }
    setAnchorEl(null);
    if (n.href) navigate(n.href);
  };

  const handleMarkAll = () => {
    notificationsApi.markAllRead().then(() => load());
  };

  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)} title="Notifications">
        <Badge badgeContent={count} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ style: { minWidth: 340, maxWidth: 420 } }}
      >
        {items.length > 0 && (
          <Box px={2} py={1} display="flex" justifyContent="flex-end">
            <Button size="small" onClick={handleMarkAll}>Mark all read</Button>
          </Box>
        )}
        {items.length === 0 ? (
          <MenuItem disabled>
            <ListItemText primary="No notifications" />
          </MenuItem>
        ) : (
          items.map((n) => (
            <MenuItem
              key={n.id}
              onClick={() => handleOpen(n)}
              style={{ opacity: n.read ? 0.7 : 1, background: n.read ? undefined : "rgba(33,150,243,0.08)" }}
            >
              <ListItemText
                primary={n.title}
                secondary={
                  <Typography variant="caption" display="block" color="textSecondary">
                    {n.message}
                  </Typography>
                }
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
