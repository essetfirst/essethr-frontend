import React from "react";
import { useNavigate } from "react-router-dom";

import { useSnackbar } from "notistack";

import { makeStyles, Chip, Typography, Link } from "@material-ui/core";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import {
  Search as SearchIcon,
  Check as ApproveIcon,
  Delete as DeleteIcon,
  // UploadCloud as ImportIcon,
  // Download as ExportIcon,
  // Printer as PrintIcon,
  ChevronRight as ArrowRightIcon,
} from "react-feather";
import GetAppIcon from "@material-ui/icons/GetApp";
import API from "../../../api";

import useNotificationSnackbar from "../../../providers/notification-snackbar";
import usePayroll from "../../../providers/payroll";

import PageView from "../../../components/PageView";

import TableComponent from "../../../components/TableComponent";
import Searchbar from "../../../components/common/Searchbar";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "10%",
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
}));

const types = {
  REQUESTING: "REQUESTING",
  REQUEST_SUCCESS: "REQUEST_SUCCESS",
  REQUEST_ERROR: "REQUEST_ERROR",
  UPDATE_PAYROLL: "UPDATE_PAYROLL",
  DELETE_PAYROLL: "DELETE_PAYROLL",
};

const initialState = { payroll: null, requesting: false, error: null };
const reducer = (state, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case types.REQUESTING:
      return { ...state, requesting: true, error: null };
    case types.REQUEST_SUCCESS:
      return { ...state, payroll: payload, requesting: false, error: null };
    case types.REQUEST_ERROR:
      return { ...state, requesting: false, error };
    default:
      return state;
  }
};

const PayrollListView = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  // const { state, onFetchPayrolls, onUpdatePayroll, onDeletePayroll } =
  //   usePayroll() || {};

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { notificationSnackbar } = useNotificationSnackbar();
  const notify = notificationSnackbar(enqueueSnackbar, closeSnackbar);

  // const fetchPayrolls = onFetchPayrolls(notify);
  const handleUpdatePayroll = async () => {
    // onUpdatePayroll();
  };
  const handleDeletePayroll = async () => {
    // onDeletePayroll();
  };
  // const handleDeletePayroll = onDeletePayroll(notify);

  const fetchPayroll = React.useCallback(() => {
    dispatch({ type: types.REQUESTING });
    API.payroll
      .getAll()
      .then(({ success, payroll, error }) => {
        success
          ? dispatch({ type: types.REQUEST_SUCCESS, payload: payroll })
          : dispatch({
              type: types.REQUEST_ERROR,
              error: "Payroll does not exists.",
            });
        console.log(payroll);

        error && console.error(error);
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: types.REQUEST_ERROR, error: "Something went wrong." });
      });
  }, []);

  React.useEffect(() => {
    console.log("Stateeeeeeeeeee", state);
    fetchPayroll();
  }, []);

  const handleRetry = () => {
    // onFetchPayrolls();
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
      icon={<CreditCardIcon />}
      actions={[
        {
          type: "button",
          label: "Generate",
          handler: handleGenerateClick,
          icon: { node: <GetAppIcon size="16px" /> },
          otherProps: {
            variant: "contained",
            color: "primary",
            size: "small",
          },
        },
      ]}
      className={classes.root}
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
