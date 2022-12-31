import React from "react";
import { useNavigate } from "react-router-dom";

import { makeStyles, Chip, Typography } from "@material-ui/core";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import {
  Check as ApproveIcon,
  Delete as DeleteIcon,
  ChevronRight as ArrowRightIcon,
} from "react-feather";
import GetAppIcon from "@material-ui/icons/GetApp";
import API from "../../../api";

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

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const handleDeletePayroll = async () => {};

  const fetchPayroll = React.useCallback(() => {
    dispatch({ type: types.REQUESTING });
    API.payroll
      .getAll({})
      .then(({ success, payrolls, error }) => {
        success
          ? dispatch({ type: types.REQUEST_SUCCESS, payload: payrolls })
          : dispatch({
              type: types.REQUEST_ERROR,
              error: "Payroll does not exists.",
            });
        console.log(payrolls);

        error && console.error(error);
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: types.REQUEST_ERROR, error: "Something went wrong." });
      });
  }, []);

  React.useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

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

  const handleDeletePayrolls = () => {
    console.log(selectedPayrolls);
    selectedPayrolls.forEach((_id) => handleDeletePayroll(_id));
  };
  const handleApprovePayrolls = () => {
    selectedPayrolls.forEach((_id) =>
      handleDeletePayroll(_id, { _id, status: "approved" })
    );
  };

  return (
    <PageView
      title="Payroll"
      icon={
        <span style={{ verticalAlign: "middle" }}>
          <CreditCardIcon fontSize="large" />
        </span>
      }
      backPath="/app/dashboard"
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
            renderCell: ({ _id, payrollTitle }) => (
              <Typography
                variant="subtitle2"
                // component={Link}
                // href={`/app/payroll/${_id}`}
                onClick={() => handleRowClick({ _id })}
                style={{ cursor: "pointer" }}
              >
                {payrollTitle}
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
