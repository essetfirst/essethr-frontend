import { Navigate } from "react-router-dom";

/** Analytics lives on the main dashboard; keep route as redirect for bookmarks. */
export default function AnalyticsDashboard() {
  return <Navigate to="/app/dashboard" replace />;
}
