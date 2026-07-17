import { createTheme } from "@mui/material/styles";
import typography from "./typography";
import shadows from "./shadows";
import { palette, lightSurfaces, darkSurfaces, shape, fontFamily } from "./tokens";
import { getComponentOverrides } from "./components";

const baseTheme = {
  shape,
  typography: {
    ...typography,
    fontFamily,
  },
  shadows,
};

function buildTheme(mode) {
  const isLight = mode === "light";
  const surfaces = isLight ? lightSurfaces : darkSurfaces;

  const theme = createTheme({
    ...baseTheme,
    palette: {
      mode,
      primary: palette.primary,
      secondary: palette.secondary,
      success: palette.success,
      warning: palette.warning,
      error: palette.error,
      info: palette.info,
      background: {
        default: surfaces.default,
        paper: surfaces.paper,
      },
      text: isLight
        ? { primary: "#0f172a", secondary: "#64748b" }
        : { primary: "#f1f5f9", secondary: "#94a3b8" },
      divider: surfaces.divider,
    },
  });

  theme.components = getComponentOverrides(theme);
  return theme;
}

export const lightTheme = buildTheme("light");
export const darkTheme = buildTheme("dark");
