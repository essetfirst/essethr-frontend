import { useContext } from "react";

import Context from "./Context";

export { default as withTheme } from "./with.js";
export { default as ThemeProvider } from "./Provider.js";

export function useTheme() {
  return useContext(Context);
}
