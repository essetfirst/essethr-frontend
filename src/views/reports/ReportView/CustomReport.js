import React from "react";

import { Box, Typography } from "@material-ui/core";

import API from "../../../api";

import PageView from "../../../components/PageView";
import ErrorBoxComponent from "../../../components/ErrorBoxComponent";
import LoadingComponent from "../../../components/LoadingComponent";

import GenerateReportDialog from "./GenerateReportDialog";

import EmployeeReport from "./EmployeeReport";
import PayrollReport from "./PayrollReport";

const types = {
  REQUESTING: "REQUESTING",
  REQUEST_SUCCESS: "REQUEST_SUCCESS",
  REQUEST_FAILURE: "REQUEST_FAILURE",
};
const initialState = {
  results: {},
  requesting: false,
  error: null,
};
const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.REQUESTING:
      return { ...state, requesting: true, error: null };
    case types.REQUEST_SUCCESS:
      return { ...state, results: payload, requesting: false, error: null };
    case types.REQUEST_FAILURE:
      return { ...state, requesting: false, error };
    default:
      return state;
  }
};

const CustomReport = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // const [filters, setFilters] = React.useState({});
  const today = new Date();
  const startDate = new Date(today.setHours(0, 0, 0) - 28 * 24 * 3600000)
    .toISOString()
    .slice(0, 10);
  const endDate = today.toISOString().slice(0, 10);
  const [generateFilters, setGenerateFilters] = React.useState({
    reportType: "employees",
    department: "ALL",
    fromDate: startDate,
    toDate: endDate,
  });

  const fetchReport = (generateFilters) => {
    const { reportType, fromDate, toDate } = generateFilters;
    let query = { fromDate, toDate };

    dispatch({ type: types.REQUESTING });
    API[reportType]
      .getReport({ query })
      .then((response) => {
        const { success, report, error } = response;
        success
          ? dispatch({
              type: types.REQUEST_SUCCESS,
              payload: report,
            })
          : dispatch({ type: types.REQUEST_FAILURE, error });
      })
      .catch((e) => {
        console.error(e);
        dispatch({
          type: types.REQUEST_FAILURE,
          error: "Something went wrong.",
        });
      });
  };

  const [generateDialogOpen, setGenerateDialogOpen] = React.useState(false);
  const handleGenerateDialogOpen = () => setGenerateDialogOpen(true);
  const handleGenerateDialogClose = () => setGenerateDialogOpen(false);

  const handleGenerateClick = () => {
    handleGenerateDialogOpen();
  };

  const handleExportClick = () => {};
  const handlePrintClick = () => {};

  const handleGenerateReport = (generateFiltersFromDialog) => {
    setGenerateFilters(generateFiltersFromDialog);
    fetchReport(generateFiltersFromDialog);
  };

  const handleRetry = () => {
    fetchReport(generateFilters);
  };

  return (
    <PageView
      title="Custom Reports"
      actions={[
        {
          label: "Generate Report",
          handler: handleGenerateClick,
          otherProps: { variant: "contained", color: "primary", size: "small" },
        },
        {
          label: "Export as PDF",
          handler: handleExportClick,
          position: "right",
          otherProps: { variant: "outlined", size: "small" },
        },
        {
          label: "Print",
          handler: handlePrintClick,
          position: "right",
          otherProps: { variant: "outlined", size: "small" },
        },
      ]}
    >
      <GenerateReportDialog
        generateFilters={generateFilters}
        open={generateDialogOpen}
        onClose={handleGenerateDialogClose}
        onGenerate={handleGenerateReport}
      />
      {state.requesting ? (
        <Box
          p={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h6" align="center" gutterBottom>
            Generating report ...
          </Typography>
          <LoadingComponent />
        </Box>
      ) : state.error ? (
        <ErrorBoxComponent error={state.error} onRetry={handleRetry} />
      ) : Object.keys(state.results).length === 0 ? (
        <>
          <Box display="flex" justifyContent="center" p={2}>
            <Typography variant="h6" gutterBottom>
              Click button on the left to generate report.
            </Typography>
          </Box>
        </>
      ) : generateFilters.reportType === "employees" ? (
        <EmployeeReport {...state.results} />
      ) : generateFilters.reportType === "payroll" ? (
        <PayrollReport {...state.results} />
      ) : (
        <div>
          Display report based on type: <br />{" "}
          <code>{JSON.stringify(state.results)}</code>
        </div>
      )}
    </PageView>
  );
};

export default CustomReport;
