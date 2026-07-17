import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import { Paper, Typography, Box, Button, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const StyledCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: 10,
  transition: "box-shadow 0.2s ease, transform 0.2s ease",
  "&:hover": {
    boxShadow:
      theme.palette.mode === "light"
        ? "0 8px 24px rgba(15, 23, 42, 0.08)"
        : "0 8px 24px rgba(0, 0, 0, 0.24)",
    transform: "translateY(-1px)",
  },
}));

const StyledValue = styled(Typography)({
  fontSize: "1.75rem",
  fontWeight: 700,
  lineHeight: 1.1,
});

const StyledItemRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: "8px 0",
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": { borderBottom: "none" },
}));

const severityMap = {
  warning: "warning",
  error: "error",
  info: "info",
  success: "success",
};

export default function ActionCard({
  title,
  value,
  subtitle,
  severity,
  href,
  items = [],
  actionLabel = "View all",
}) {
  const chipColor = severityMap[severity] || "default";

  return (
    <StyledCard variant="outlined" elevation={0}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
        <Typography variant="overline" color="text.secondary">
          {title}
        </Typography>
        {severity && (
          <Chip
            size="small"
            color={chipColor}
            label={severity}
            sx={{ textTransform: "capitalize", fontWeight: 500 }}
          />
        )}
      </Box>
      {value != null && (
        <StyledValue color="primary" sx={{ mb: subtitle ? 0.5 : 1 }}>
          {value}
        </StyledValue>
      )}
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {subtitle}
        </Typography>
      )}
      {items.length > 0 && (
        <Box flex={1} mb={1.5}>
          {items.slice(0, 5).map((item) => (
            <StyledItemRow key={item.id || item.employeeId || item.name}>
              <Typography variant="body2" fontWeight={500} noWrap sx={{ flex: 1 }}>
                {item.name || item.title}
              </Typography>
              {item.subtitle && (
                <Typography variant="caption" color="text.secondary" noWrap>
                  {item.subtitle}
                </Typography>
              )}
            </StyledItemRow>
          ))}
        </Box>
      )}
      {href && (
        <Button
          component={RouterLink}
          to={href}
          size="small"
          color="primary"
          endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
          sx={{ alignSelf: "flex-start", mt: "auto" }}
        >
          {actionLabel}
        </Button>
      )}
    </StyledCard>
  );
}

ActionCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subtitle: PropTypes.string,
  severity: PropTypes.string,
  href: PropTypes.string,
  items: PropTypes.array,
  actionLabel: PropTypes.string,
};
