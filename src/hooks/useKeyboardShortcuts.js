import React from "react";
import { useNavigate } from "react-router-dom";
import usePermissions from "features/auth/hooks/usePermissions";
import { PERMISSIONS } from "constants/permissions";

const SHORTCUTS = [
  { keys: ["Ctrl", "K"], label: "Open command palette / search" },
  { keys: ["?"], label: "Show keyboard shortcuts" },
  { keys: ["G", "D"], label: "Go to Dashboard" },
  { keys: ["G", "E"], label: "Go to Employees" },
  { keys: ["G", "L"], label: "Go to Leaves" },
  { keys: ["G", "A"], label: "Go to Attendance" },
  { keys: ["G", "P"], label: "Go to Payroll" },
  { keys: ["G", "I"], label: "Go to Approvals" },
  { keys: ["G", "R"], label: "Go to Recruitment" },
  { keys: ["Esc"], label: "Close dialogs" },
];

const GO_ROUTES = {
  d: "/app/dashboard",
  e: "/app/employees",
  l: "/app/leaves",
  a: "/app/attendance",
  p: "/app/payroll/list",
  i: "/app/inbox",
  r: "/app/recruitment",
  o: "/app/portal",
  s: "/app/settings",
};

export default function useKeyboardShortcuts({ onOpenCommandPalette, onOpenHelp } = {}) {
  const navigate = useNavigate();
  const { canAny } = usePermissions();
  const pendingGo = React.useRef(null);
  const goTimer = React.useRef(null);

  React.useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      const typing = tag === "input" || tag === "textarea" || tag === "select" || e.target?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenCommandPalette?.();
        return;
      }

      if (!typing && e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onOpenHelp?.();
        return;
      }

      if (typing) return;

      if (pendingGo.current) {
        const route = GO_ROUTES[e.key.toLowerCase()];
        clearTimeout(goTimer.current);
        pendingGo.current = null;
        if (route) {
          if (
            route === "/app/inbox" &&
            !canAny(
              PERMISSIONS.LEAVES_APPROVE,
              PERMISSIONS.WORKFLOWS_APPROVE,
              PERMISSIONS.ATTENDANCE_APPROVE,
              PERMISSIONS.PAYROLL_APPROVE,
            )
          ) return;
          e.preventDefault();
          navigate(route);
        }
        return;
      }

      if (e.key.toLowerCase() === "g") {
        pendingGo.current = true;
        goTimer.current = setTimeout(() => {
          pendingGo.current = null;
        }, 1200);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(goTimer.current);
    };
  }, [navigate, onOpenCommandPalette, onOpenHelp, canAny]);
}

export { SHORTCUTS };
