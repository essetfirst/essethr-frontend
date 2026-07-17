import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Avatar, Box, Button, Drawer, Hidden, List, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import {
  PaymentOutlined as PayrollIcon,
  TimeToLeaveOutlined as LeaveIcon,
  DashboardOutlined as DashboardIcon,
  InboxOutlined as InboxIcon,
} from "@mui/icons-material";

import ContactlessIconOutlined from "@mui/icons-material/ContactlessOutlined";
import GroupIconOutlined from "@mui/icons-material/GroupOutlined";
import TimerIconOutlined from "@mui/icons-material/TimerOutlined";
import AssessmentIconOutlined from "@mui/icons-material/AssessmentOutlined";
import SettingsIconOutlined from "@mui/icons-material/SettingsOutlined";
import VerifiedUserIconOutlined from "@mui/icons-material/VerifiedUserOutlined";
import NavItem from "./NavItem";
// import RecentActorsIconOutlined from "@mui/icons-material/RecentActorsOutlined";
import useAuth from "features/auth/providers";
import usePermissions from "features/auth/hooks/usePermissions";
import { PERMISSIONS } from "constants/permissions";

const navItems = [
  {
    href: "/app/dashboard",
    icon: DashboardIcon,
    title: "Dashboard",
  },
  {
    href: "/app/org",
    icon: VerifiedUserIconOutlined,
    title: "Admin",
    permission: PERMISSIONS.ORG_READ,
  },
  {
    href: "/app/employees",
    icon: GroupIconOutlined,
    title: "Employees",
    permission: PERMISSIONS.EMPLOYEES_READ,
  },
  {
    href: "/app/attendance",
    icon: TimerIconOutlined,
    title: "Attendance",
    permission: PERMISSIONS.ATTENDANCE_READ,
  },
  {
    href: "/app/leaves",
    icon: LeaveIcon,
    title: "Leaves and Time-off",
    permission: PERMISSIONS.LEAVES_READ,
  },
  {
    href: "/app/payroll",
    icon: PayrollIcon,
    title: "Payroll",
    permission: PERMISSIONS.PAYROLL_READ,
  },
  {
    href: "/app/reports",
    icon: AssessmentIconOutlined,
    title: "Reports",
    permission: PERMISSIONS.REPORTS_READ,
  },
  {
    href: "/app/manager",
    icon: GroupIconOutlined,
    title: "Manager",
    anyOf: [
      PERMISSIONS.LEAVES_APPROVE,
      PERMISSIONS.WORKFLOWS_APPROVE,
      PERMISSIONS.ATTENDANCE_APPROVE,
    ],
  },
  {
    href: "/app/inbox",
    icon: InboxIcon,
    title: "Approvals",
    anyOf: [
      PERMISSIONS.LEAVES_APPROVE,
      PERMISSIONS.WORKFLOWS_APPROVE,
      PERMISSIONS.ATTENDANCE_APPROVE,
      PERMISSIONS.PAYROLL_APPROVE,
    ],
  },
  {
    href: "/app/portal",
    icon: ContactlessIconOutlined,
    title: "My Portal",
    permission: PERMISSIONS.ESS_ACCESS,
  },
  {
    href: "/app/shifts",
    icon: TimerIconOutlined,
    title: "Shifts",
    permission: PERMISSIONS.SHIFTS_READ,
  },
  {
    href: "/app/recruitment",
    icon: GroupIconOutlined,
    title: "Recruitment",
    permission: PERMISSIONS.RECRUITMENT_READ,
  },
  {
    href: "/app/onboarding",
    icon: GroupIconOutlined,
    title: "Onboarding",
    permission: PERMISSIONS.ONBOARDING_READ,
  },
  {
    href: "/app/offboarding",
    icon: GroupIconOutlined,
    title: "Offboarding",
    permission: PERMISSIONS.OFFBOARDING_READ,
  },
  {
    href: "/app/performance",
    icon: AssessmentIconOutlined,
    title: "Performance",
    permission: PERMISSIONS.PERFORMANCE_READ,
  },
  {
    href: "/app/training",
    icon: SettingsIconOutlined,
    title: "Training",
    permission: PERMISSIONS.TRAINING_READ,
  },
  {
    href: "/app/benefits",
    icon: SettingsIconOutlined,
    title: "Benefits",
    permission: PERMISSIONS.BENEFITS_READ,
  },
  {
    href: "/app/expenses",
    icon: SettingsIconOutlined,
    title: "Expenses",
    permission: PERMISSIONS.EXPENSES_READ,
  },
  {
    href: "/app/users",
    icon: GroupIconOutlined,
    title: "Users",
    permission: PERMISSIONS.USERS_READ,
  },
  {
    href: "/app/settings",
    icon: SettingsIconOutlined,
    title: "Settings",
    permission: PERMISSIONS.SETTINGS_READ,
  },
];

// const adminNavItems = [
//   {
//     href: "/app/orgs",
//     icon: OrganizationIcon,
//     title: "Organizations",
//   },
//   {
//     href: "/app/users",
//     icon: RecentActorsIconOutlined,
//     title: "Users",
//   },
// ];

// console.log("navItems", adminNavItems);

const drawerPaperSx = (sidebarWidth, sidebarMinWidth) => ({
  mobile: { width: sidebarWidth - 20 },
  desktop: {
    width: sidebarWidth,
    top: 64,
    height: "calc(100% - 64px)",
  },
  min: {
    width: sidebarMinWidth,
    top: 64,
    height: "calc(100% - 64px)",
    overflow: "hidden",
  },
});

const UserCard = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  margin: theme.spacing(1),
  borderRadius: 10,
  textDecoration: "none",
  color: "inherit",
  border: `1px solid ${theme.palette.mode === "light" ? "rgba(15,23,42,0.06)" : "rgba(148,163,184,0.12)"}`,
  transition: "background-color 0.15s ease",
  "&:hover": {
    backgroundColor: theme.palette.mode === "light" ? "rgba(37,99,235,0.04)" : "rgba(37,99,235,0.08)",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  fontSize: "0.875rem",
  fontWeight: 600,
  backgroundColor: theme.palette.mode === "light" ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.2)",
  color: theme.palette.primary.main,
}));

const NavBar = ({
  onMobileClose,
  openMobile,
  openMinimize,
  sidebarWidth = 260,
  sidebarMinWidth = 72,
}) => {
  const location = useLocation();
  const { auth } = useAuth();
  const { can } = usePermissions();
  const visibleNavItems = navItems.filter((item) => {
    if (item.anyOf?.length) return item.anyOf.some((p) => can(p));
    if (item.permission) return can(item.permission);
    return true;
  });

  const paperSx = drawerPaperSx(sidebarWidth, sidebarMinWidth);
  const userInitials = (auth?.user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          slotProps={{ paper: { sx: paperSx.mobile } }}
        >
          <PerfectScrollbar>{itemsNav()}</PerfectScrollbar>
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          slotProps={{
            paper: { sx: openMinimize ? paperSx.min : paperSx.desktop },
          }}
        >
          {openMinimize ? (
            <>{itemsMin()}</>
          ) : (
            <PerfectScrollbar>{itemsNav()}</PerfectScrollbar>
          )}
        </Drawer>
      </Hidden>
    </>
  );

  function itemsNav() {
    return (
      <Box height="100%" display="flex" flexDirection="column">
        {auth.isAuth && (
          <UserCard component={RouterLink} to="/app/account">
            <StyledAvatar>{userInitials}</StyledAvatar>
            <Box minWidth={0}>
              <Typography variant="subtitle2" fontWeight={600} noWrap>
                {auth.user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {auth.user?.role}
              </Typography>
            </Box>
          </UserCard>
        )}
        <Box flex={1} py={0.5} px={0.5}>
          <List disablePadding>
            {visibleNavItems.map((item) => (
              <NavItem
                href={item.href}
                key={item.title}
                title={item.title}
                icon={item.icon}
              />
            ))}
          </List>
        </Box>
        <Hidden mdDown>
          <Box px={2} py={2} mt="auto">
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<ContactlessIconOutlined fontSize="small" />}
              onClick={() => {
                window.open(
                  "https://essethr-fron-dev-kch2mcb4lukj4.herokuapp.com/home",
                  "_blank",
                );
              }}
            >
              Contact support
            </Button>
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1.5}>
              Powered by EsseHR
            </Typography>
          </Box>
        </Hidden>
      </Box>
    );
  }

  function itemsMin() {
    return (
      <Box height="100%" display="flex" flexDirection="column" alignItems="center" py={1}>
        {auth.isAuth && (
          <Box component={RouterLink} to="/app/account" p={1}>
            <StyledAvatar sx={{ width: 36, height: 36, fontSize: "0.75rem" }}>
              {userInitials}
            </StyledAvatar>
          </Box>
        )}
        <Box flex={1} width="100%" px={0.5} pt={1}>
          <List disablePadding>
            {visibleNavItems.map((item) => (
              <NavItem href={item.href} key={item.title} icon={item.icon} />
            ))}
          </List>
        </Box>
      </Box>
    );
  }
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
};

export default NavBar;
