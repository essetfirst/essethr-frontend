import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const LABEL_OVERRIDES = {
  app: "Home",
  dashboard: "Dashboard",
  settings: "Settings",
  employees: "Employees",
  leaves: "Leave",
  payroll: "Payroll",
  attendance: "Attendance",
  reports: "Reports",
  analytics: "Analytics",
  documents: "Documents",
  recruitment: "Recruitment",
  onboarding: "Onboarding",
  performance: "Performance",
  training: "Training",
  inbox: "Approvals",
  workflows: "Approval rules",
  announcements: "Announcements",
  shifts: "Shifts",
  audit: "Audit",
};

function formatSegment(segment) {
  if (LABEL_OVERRIDES[segment]) return LABEL_OVERRIDES[segment];
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Breadcrumbs derived from URL path segments.
 */
const BreadcrumbsNav = ({ basePath = "/app", exclude = [] }) => {
  const location = useLocation();
  const normalizedBase = basePath.replace(/\/$/, "");
  const relativePath = location.pathname.startsWith(normalizedBase)
    ? location.pathname.slice(normalizedBase.length)
    : location.pathname;

  const segments = relativePath.split("/").filter(Boolean).filter((s) => !exclude.includes(s));

  if (segments.length === 0) return null;

  const crumbs = segments.map((segment, index) => {
    const path = `${normalizedBase}/${segments.slice(0, index + 1).join("/")}`;
    const label = formatSegment(segment);
    const isLast = index === segments.length - 1;

    return isLast ? (
      <Typography key={path} color="textPrimary" variant="body2">
        {label}
      </Typography>
    ) : (
      <Link key={path} component={RouterLink} to={path} color="inherit" variant="body2">
        {label}
      </Link>
    );
  });

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <Link component={RouterLink} to={normalizedBase} color="inherit" variant="body2">
        Home
      </Link>
      {crumbs}
    </Breadcrumbs>
  );
};

BreadcrumbsNav.propTypes = {
  basePath: PropTypes.string,
  exclude: PropTypes.arrayOf(PropTypes.string),
};

export default BreadcrumbsNav;
