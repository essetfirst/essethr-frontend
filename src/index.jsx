import { createRoot } from "react-dom/client";
import "./chartJsRegister";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./providers/theme";
import { I18nProvider } from "./i18n";
import { queryClient } from "./lib/queryClient";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nProvider>
    </QueryClientProvider>
  </ThemeProvider>,
);
