import React from "react";

import PageView from "../../components/PageView";

import AttendancePanel from "./AttendancePanel";
// import TimesheetsPanel from "./TimesheetsPanel";

import { Clock as TimeIcon } from "react-feather";

const AttendanceView = () => {
  return (
    <PageView
      title="Time management"
      icon={
        <span style={{ verticalAlign: "middle" }}>
          <TimeIcon fontSize="large" />
        </span>
      }
      actions={
        [
          // {
          //   label: "Check in",
          //   handler: handleCheckinClick,
          //   otherProps: {
          //     variant: "contained",
          //     color: "primary",
          //     size: "small",
          //     "aria-label": "check in",
          //   },
          // },
          // {
          //   label: "Check out",
          //   handler: handleCheckoutClick,
          //   otherProps: {
          //     variant: "contained",
          //     color: "secondary",
          //     size: "small",
          //     "aria-label": "check out",
          //   },
          // },
          // {
          //   type: "button",
          //   variant: "outlined",
          //   icon: { node: <ImportIcon size="16px" /> },
          //   label: "Import",
          //   handler: handleImportClick,
          //   position: "right",
          //   otherProps: {
          //     size: "small",
          //     "aria-label": "import",
          //   },
          // },
          // {
          //   type: "button",
          //   variant: "outlined",
          //   icon: { node: <ExportIcon size="16px" /> },
          //   label: "Export",
          //   handler: handleExportClick,
          //   position: "right",
          //   otherProps: {
          //     size: "small",
          //     "aria-label": "export",
          //   },
          // },
          // {
          //   type: "button",
          //   variant: "outlined",
          //   icon: { node: <PrintIcon size="16px" /> },
          //   label: "Print",
          //   handler: handlePrintClick,
          //   position: "right",
          //   otherProps: {
          //     size: "small",
          //     "aria-label": "print",
          //   },
          // },
        ]
      }
    >
      <AttendancePanel />
      {/*       
      <TabbedComponent
        tabs={[
          // { label: "Attendance", panel: <AttendancePanel /> },
          { label: "Attendance", panel: <AttendancePanel /> },
          { label: "Timesheets", panel: <TimesheetsPanel /> },
        ]}
      /> */}
    </PageView>
  );
};

export default AttendanceView;
