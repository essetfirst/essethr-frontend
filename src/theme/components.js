import { alpha } from "@mui/material/styles";
import { darkSurfaces, lightSurfaces, shape } from "./tokens";

const inputRadius = shape.borderRadiusSm;

export function getComponentOverrides(theme) {
  const isLight = theme.palette.mode === "light";
  const surfaces = isLight ? lightSurfaces : darkSurfaces;

  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        },
        "#root": {
          minHeight: "100%",
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: "inherit",
      },
      styleOverrides: {
        root: {
          backgroundColor: isLight ? "#ffffff" : darkSurfaces.paper,
          borderBottom: `1px solid ${surfaces.border}`,
          color: theme.palette.text.primary,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: isLight ? "#ffffff" : darkSurfaces.paper,
          borderRight: `1px solid ${surfaces.border}`,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: inputRadius,
          fontWeight: 600,
          textTransform: "none",
          padding: "8px 16px",
        },
        containedPrimary: {
          boxShadow: `0 1px 2px ${alpha(theme.palette.primary.main, 0.24)}`,
          "&:hover": {
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.28)}`,
          },
        },
        outlined: {
          borderColor: surfaces.border,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
          border: `1px solid ${surfaces.border}`,
          backgroundImage: "none",
          boxShadow: isLight
            ? "0 1px 2px rgba(15, 23, 42, 0.04)"
            : "none",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        outlined: {
          border: `1px solid ${surfaces.border}`,
          borderRadius: shape.borderRadius,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: inputRadius,
          backgroundColor: isLight ? "#ffffff" : alpha("#ffffff", 0.03),
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(theme.palette.primary.main, 0.4),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1.5,
          },
        },
        notchedOutline: {
          borderColor: surfaces.border,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: "none",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: isLight ? lightSurfaces.subtle : alpha("#ffffff", 0.03),
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${surfaces.divider}`,
          fontSize: "0.8125rem",
          padding: "12px 16px",
        },
        head: {
          fontWeight: 600,
          fontSize: "0.75rem",
          color: theme.palette.text.secondary,
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background-color 0.15s ease",
          "&:hover": {
            backgroundColor: isLight
              ? alpha(theme.palette.primary.main, 0.04)
              : alpha(theme.palette.primary.main, 0.08),
          },
          "&.Mui-selected": {
            backgroundColor: alpha(theme.palette.primary.main, isLight ? 0.08 : 0.12),
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, isLight ? 0.1 : 0.14),
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: "0.75rem",
        },
        filled: {
          border: "none",
        },
        outlined: {
          borderColor: surfaces.border,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: shape.borderRadiusLg,
          border: `1px solid ${surfaces.border}`,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 2,
          borderRadius: 1,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
          minHeight: 44,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: surfaces.divider,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: shape.borderRadiusSm,
          border: `1px solid ${surfaces.border}`,
          boxShadow: isLight
            ? "0 8px 24px rgba(15, 23, 42, 0.12)"
            : "0 8px 24px rgba(0, 0, 0, 0.4)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadiusSm,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadiusSm,
        },
      },
    },
  };
}
