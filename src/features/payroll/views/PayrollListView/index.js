import { fmt } from "utils/date";
import React from "react";
import { useNavigate } from "react-router-dom";

import { Chip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import {
  Check as ApproveIcon,
  Delete as DeleteIcon,
  ChevronRight as ArrowRightIcon,
} from "react-feather";
import GetAppIcon from "@mui/icons-material/GetApp";
import { useSnackbar } from "notistack";
import API from "api";

import PageView from "components/PageView";

import TableComponent from "components/TableComponent";
import Searchbar from "components/common/Searchbar";

const StyledRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.dark,
    height: "10%",
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
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
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = React.useReducer(reducer, initialState);

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

        error && console.error(error);
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: types.REQUEST_ERROR, error: "Something went wrong." });
      });
  }, []);

  const handleDeletePayroll = async (id) => {
    const res = await API.payroll.deleteById(id);
    if (res?.success) {
      enqueueSnackbar("Payroll deleted.", { variant: "success" });
      fetchPayroll();
    } else {
      enqueueSnackbar(res?.error || "Delete failed.", { variant: "error" });
    }
  };

  React.useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  const handleRetry = () => {
    fetchPayroll();
  };

  const [filters, setFilters] = React.useState("");

  const handleFilterChange = () => (e) => {
    const { value } = e.target;
    setFilters(value);
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
    selectedPayrolls.forEach((_id) => handleDeletePayroll(_id));
  };
  const handleApprovePayrolls = () => {
    selectedPayrolls.forEach(async (_id) => {
      const res = await API.payroll.finalize(_id);
      if (res?.success) enqueueSnackbar("Payroll finalized.", { variant: "success" });
    });
    fetchPayroll();
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
      component={StyledRoot}
    >
      <Searchbar
        searchTerm={filters}
        onSearchTermChange={handleFilterChange}
        searchTermPlaceholder="Search by title"
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
                href={`/app/payroll/${_id}`}
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
            renderCell: ({ fromDate }) => fmt(fromDate, "dd/MM/yyyy"),
          },
          {
            field: "toDate",
            label: "End Date",
            renderCell: ({ toDate }) => fmt(toDate, "dd/MM/yyyy"),
          },
          { field: "employeesCount", label: "No. of Employees" },
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
        data={(state.payroll || []).filter((payroll) => {
          const { title, fromDate, toDate, status } = payroll;
          const searchTerm = filters.toLowerCase();
          return (
            title.toLowerCase().includes(searchTerm) ||
            fmt(fromDate, "dd/MM/yyyy").includes(searchTerm) ||
            fmt(toDate, "dd/MM/yyyy").includes(searchTerm) ||
            status.toLowerCase().includes(searchTerm)
          );
        })}
        requestState={{
          requesting: state.requesting,
          error: state.error,
          onRetry: handleRetry,
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
    </PageView>
  );
};

export default PayrollListView;
