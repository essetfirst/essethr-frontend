import React from "react";
import { useNavigate } from "react-router-dom";

import { useSnackbar } from "notistack";

import { makeStyles, Chip, Typography, Link } from "@material-ui/core";

import {
  Search as SearchIcon,
  Check as ApproveIcon,
  Delete as DeleteIcon,
  // UploadCloud as ImportIcon,
  // Download as ExportIcon,
  // Printer as PrintIcon,
  ChevronRight as ArrowRightIcon,
} from "react-feather";

import API from "../../../api";

import useNotificationSnackbar from "../../../providers/notification-snackbar";
import usePayroll from "../../../providers/payroll";

import PageView from "../../../components/PageView";

import TableComponent from "../../../components/TableComponent";
import Searchbar from "../../../components/common/Searchbar";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const types = {
  REQUESTING: "REQUESTING",
  REQUEST_SUCCESS: "REQUEST_SUCCESS",
  REQUEST_ERROR: "REQUEST_ERROR",
  UPDATE_PAYROLL: "UPDATE_PAYROLL",
  DELETE_PAYROLL: "DELETE_PAYROLL",
};
const initialState = { payrolls: [], requesting: false, error: null };
const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.REQUESTING:
      return { ...state, requesting: true, error: null };
    case types.REQUEST_SUCCESS:
      return { ...state, payrolls: payload, requesting: false, error: null };
    case types.REQUEST_ERROR:
      return { ...state, requesting: false, error };
    case types.UPDATE_PAYROLL:
      let uIndex = state.payrolls.findIndex(({ _id }) => _id === payload._id);
      console.log("Updated index: ", uIndex);
      if (uIndex === -1) {
        return state;
      }
      const newPayroll = { ...state.payrolls[uIndex], ...payload };
      return {
        ...state,
        payrolls: [
          ...state.payrolls.slice(0, uIndex),
          newPayroll,
          ...state.payrolls.slice(uIndex + 1),
        ],
      };

    case types.DELETE_PAYROLL:
      let dIndex = state.payrolls.findIndex(({ _id }) => _id === payload);
      if (dIndex === -1) {
        return state;
      }
      const newPayrolls = [
        ...state.payrolls.slice(0, dIndex),
        ...state.payrolls.slice(dIndex),
      ];
      return { ...state, payrolls: newPayrolls };

    default:
      return state;
  }
};

const PayrollListView = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  // const [state, dispatch] = React.useReducer(reducer, initialState);
  // const fetchPayrolls = React.useCallback(() => {
  //   dispatch({ type: types.REQUESTING });
  //   API.payroll
  //     .getAll({})
  //     .then(({ success, payrolls, error }) => {
  //       success
  //         ? dispatch({ type: types.REQUEST_SUCCESS, payload: payrolls })
  //         : dispatch({ type: types.REQUEST_ERROR, error });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       dispatch({ type: types.REQUEST_ERROR, error });
  //     });
  // }, []);

  // const handleUpdatePayroll = (id, update) => {
  //   API.payroll
  //     .updateById(id, update)
  //     .then(({ success, payroll, error }) => {
  //       if (success) {
  //         dispatch({ type: types.UPDATE_PAYROLL, payload: payroll });
  //       } else {
  //         console.error(error);
  //         // Notify user via notistack Snackbar
  //       }
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //       // Notify user via notistack Snackbar
  //     });
  // };

  // const handleDeletePayroll = (payrollId) => {
  //   API.payroll
  //     .deleteById(payrollId)
  //     .then(({ success, error }) => {
  //       if (success) {
  //         dispatch({ type: types.DELETE_PAYROLL, payload: payrollId });
  //       } else {
  //         console.error(error);
  //         // Notify user via notistack Snackbar
  //       }
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //       // Notify user via notistack Snackbar
  //     });
  // };

  const { state, onFetchPayrolls, onUpdatePayroll, onDeletePayroll } =
    usePayroll();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { notificationSnackbar } = useNotificationSnackbar();
  const notify = notificationSnackbar(enqueueSnackbar, closeSnackbar);

  const fetchPayrolls = onFetchPayrolls(notify);
  const handleUpdatePayroll = onUpdatePayroll(notify);
  const handleDeletePayroll = onDeletePayroll(notify);

  React.useEffect(() => {
    fetchPayrolls();
  }, [fetchPayrolls]);

  const handleRetry = () => {
    fetchPayrolls();
  };

  const [filters, setFilters] = React.useState({
    searchTerm: "",
    fromDate: "",
    toDate: "",
    sortBy: "",
    sortOrder: "",
  });

  const handleFilterChange = (filterName) => (e) => {
    setFilters({ ...filters, [filterName]: e.target.value });
  };

  const [selectedPayrolls, setSelectedPayrolls] = React.useState([]);
  const handlePayrollSelectionChange = (newSelection) =>
    setSelectedPayrolls(newSelection);

  const handleGenerateClick = () => {
    navigate("/app/payroll/generate", {
      replace: true,
    });
  };

  /* TODO: import, export, print */
  // const handleImportClick = () => {};
  // const handleExportClick = () => {};
  // const handlePrintClick = () => {};

  const handleRowClick = ({ _id }) => navigate("/app/payroll/" + _id);

  const handleApprovePayrolls = () => {
    selectedPayrolls.forEach((_id) =>
      handleUpdatePayroll(_id, { _id, status: "approved" })
    );
  };
  const handleDeletePayrolls = () => {
    console.log(selectedPayrolls);
    selectedPayrolls.forEach((_id) => handleDeletePayroll(_id));
  };

  return (
    <PageView
      title="Payroll"
      actions={[
        {
          type: "button",
          label: "generate",
          handler: handleGenerateClick,
          otherProps: { variant: "contained", color: "primary", size: "small" },
        },
        // {
        //   type: "button",
        //   label: "import",
        //   icon: { node: <ImportIcon size="16px" /> },
        //   handler: handleImportClick,
        //   position: "right",
        //   otherProps: { size: "small" },
        // },
        // {
        //   type: "button",
        //   label: "export",
        //   icon: { node: <ExportIcon size="16px" /> },
        //   handler: handleExportClick,
        //   position: "right",
        //   otherProps: { size: "small", disabled: !state.payrolls },
        // },
        // {
        //   type: "button",
        //   label: "print",
        //   icon: { node: <PrintIcon size="16px" /> },
        //   handler: handlePrintClick,
        //   position: "right",
        //   otherProps: { size: "small", disabled: !state.payrolls },
        // },
      ]}
    >
      <Searchbar
        searchTerm={filters.searchTerm}
        onSearchTermChange={handleFilterChange("searchTerm")}
      />

      <TableComponent
        size="small"
        columns={[
          {
            field: "title",
            label: "Title",
            renderCell: ({ _id, title }) => (
              <Typography
                variant="subtitle2"
                // component={Link}
                // href={`/app/payroll/${_id}`}
                onClick={() => handleRowClick({ _id })}
                style={{ cursor: "pointer" }}
              >
                {title}
              </Typography>
            ),
          },
          {
            field: "fromDate",
            label: "Start Date",
            renderCell: ({ fromDate }) =>
              new Date(fromDate).toLocaleDateString(),
          },
          {
            field: "toDate",
            label: "End Date",
            renderCell: ({ toDate }) => new Date(toDate).toLocaleDateString(),
          },
          { field: "employeesCount", label: "# of Employees", align: "center" },
          { field: "totalPayment", label: "Total Amount" },
          {
            field: "status",
            label: "Status",
            renderCell: ({ status }) => (
              <Chip
                size="small"
                label={status}
                color={status === "approved" ? "primary" : "default"}
              />
            ),
          },
        ]}
        data={state.payrolls || []}
        requestState={{
          requesting: state.requesting,
          error: state.error,
          onRetry: handleRetry(),
        }}
        rowActions={[
          {
            label: "View",
            handler: (rowProps) => handleRowClick(rowProps),
            icon: <ArrowRightIcon fontSize="small" />,
            variant: "outlined",
            size: "small",
          },
        ]}
        // onRowClick={handleRowClick}
        onSelectionChange={handlePayrollSelectionChange}
        selectionActions={[
          {
            label: "Approve",
            icon: <ApproveIcon fontSize="14" style={{ marginLeft: "4px" }} />,
            handler: handleApprovePayrolls,
            variant: "outlined",
          },
          {
            label: "Delete",
            icon: <DeleteIcon fontSize="14" style={{ marginLeft: "4px" }} />,
            handler: handleDeletePayrolls,
            variant: "outlined",
          },
        ]}
      />

      {/* <code>{JSON.stringify(state)}</code>
      {state.error && (
        <ErrorBoxComponent error={state.error} onRetry={handleRetry} />
      )} */}
    </PageView>
  );
};

export default PayrollListView;
