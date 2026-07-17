import React from "react";
import { useSearchParams } from "react-router-dom";
import { Settings as SettingsIcon } from "react-feather";
import PageView from "components/PageView";
import TabbedComponent from "components/TabbedComponent";
import PermissionGate from "components/PermissionGate";
import { PERMISSIONS } from "constants/permissions";
import PermissionsPanel from "./PermissionsPanel";
import AuditLogPanel from "./AuditLogPanel";
import OrgConfigPanel from "./OrgConfigPanel";
import CustomFieldsPanel from "./CustomFieldsPanel";
import NotificationsPanel from "./NotificationsPanel";
import ApprovalWorkflowsPanel from "./ApprovalWorkflowsPanel";
import usePermissions from "features/auth/hooks/usePermissions";

const SettingsView = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab");
  const { can } = usePermissions();

  const tabs = [
    {
      label: "Organization",
      panel: (
        <PermissionGate permission={PERMISSIONS.SETTINGS_READ} fallback={<div>Access denied.</div>}>
          <OrgConfigPanel />
        </PermissionGate>
      ),
    },
    {
      label: "Custom fields",
      panel: (
        <PermissionGate permission={PERMISSIONS.SETTINGS_WRITE} fallback={<div>Access denied.</div>}>
          <CustomFieldsPanel />
        </PermissionGate>
      ),
    },
    {
      label: "Notifications",
      panel: (
        <PermissionGate permission={PERMISSIONS.SETTINGS_READ} fallback={<div>Access denied.</div>}>
          <NotificationsPanel />
        </PermissionGate>
      ),
    },
    ...(can(PERMISSIONS.WORKFLOWS_WRITE)
      ? [{
          label: "Approval rules",
          selected: activeTab === "approval-rules",
          panel: (
            <PermissionGate permission={PERMISSIONS.WORKFLOWS_WRITE} fallback={<div>Access denied.</div>}>
              <ApprovalWorkflowsPanel />
            </PermissionGate>
          ),
        }]
      : []),
    {
      label: "Permissions",
      panel: <PermissionsPanel />,
    },
    {
      label: "Audit log",
      panel: (
        <PermissionGate permission={PERMISSIONS.AUDIT_READ} fallback={<div>Access denied.</div>}>
          <AuditLogPanel />
        </PermissionGate>
      ),
    },
  ];

  return (
    <PageView title="Settings" icon={<SettingsIcon />} backPath="/app/dashboard">
      <TabbedComponent tabs={tabs} />
    </PageView>
  );
};

export default SettingsView;
