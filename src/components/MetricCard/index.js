import React from "react";
import PropTypes from "prop-types";
import { Box, Card, CardContent, Typography, alpha } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "box-shadow 0.2s ease, transform 0.2s ease",
  "&:hover": {
    boxShadow:
      theme.palette.mode === "light"
        ? "0 8px 24px rgba(15, 23, 42, 0.08)"
        : "0 8px 24px rgba(0, 0, 0, 0.24)",
    transform: "translateY(-1px)",
  },
}));

const IconWrap = styled(Box)(({ theme, ownerState }) => ({
  width: 44,
  height: 44,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: alpha(ownerState.color || theme.palette.primary.main, 0.12),
  color: ownerState.color || theme.palette.primary.main,
  "& .MuiSvgIcon-root": {
    fontSize: 22,
  },
}));

export default function MetricCard({
  label,
  value,
  trend,
  trendLabel,
  icon: Icon,
  accentColor,
}) {
  const theme = useTheme();
  const color = accentColor || theme.palette.primary.main;

  return (
    <StyledCard>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="overline" color="text.secondary">
            {label}
          </Typography>
          {Icon && (
            <IconWrap ownerState={{ color }}>
              <Icon />
            </IconWrap>
          )}
        </Box>
        <Typography
          variant="h2"
          sx={{ fontSize: "1.875rem", fontWeight: 700, lineHeight: 1.1, mb: 1 }}
        >
          {value ?? 0}
        </Typography>
        {(trend != null || trendLabel) && (
          <Box display="flex" alignItems="center" gap={0.75}>
            {trend != null && (
              <Box
                display="flex"
                alignItems="center"
                gap={0.25}
                sx={{ color: theme.palette.success.main }}
              >
                <TrendingUpIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2" fontWeight={600}>
                  {trend}%
                </Typography>
              </Box>
            )}
            {trendLabel && (
              <Typography variant="body2" color="text.secondary">
                {trendLabel}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
}

MetricCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  trend: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  trendLabel: PropTypes.string,
  icon: PropTypes.elementType,
  accentColor: PropTypes.string,
};
