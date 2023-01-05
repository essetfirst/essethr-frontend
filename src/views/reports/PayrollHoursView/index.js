import React from "react";
import { Box, Chip, TextField } from "@material-ui/core";
import {
  Payment as PayrollHoursIcon,
  CheckCircleOutlineOutlined as CheckIcon,
} from "@material-ui/icons";
import { Download as ExportIcon } from "react-feather";
import { getTableDataForExport, makeExcel } from "../../../helpers/export";

import API from "../../../api";
import PageView from "../../../components/PageView";
import LoadingComponent from "../../../components/LoadingComponent";
import ErrorBoxComponent from "../../../components/ErrorBoxComponent";

import Searchbar from "../../../components/common/Searchbar";
import moment from "moment";
import TableComponent from "../../../components/TableComponent";

const FilterFields = ({ filters, onFilterFieldChange }) => {
  return (
    <Box display="flex" alignItems={"center"}>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        type="date"
        name="from"
        onChange={onFilterFieldChange}
        value={filters.from}
        style={{ marginRight: "8px" }}
      />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        type="date"
        name="to"
        onChange={onFilterFieldChange}
        value={filters.to}
      />
    </Box>
  );
};

const PayrollHoursFilterbar = ({ filters, onFilterChange }) => {
  return (
    <Searchbar
      onSearchTermChange={onFilterChange}
      searchTerm={filters.searchTerm}
      searchbarElements={
        <FilterFields filters={filters} onFilterFieldChange={onFilterChange} />
      }
    />
  );
};

const PayrollHoursTable = ({ data }) => {
  const columns = [
    {
      label: "Employee",
      field: "employeeName",
    },
    {
      label: "Start Date",
      field: "startDate",
      renderCell: (fromDate) => moment(fromDate).format("DD/MM/YYYY"),
    },
    {
      label: "End Date",
      field: "endDate",
      renderCell: (toDate) => moment(toDate).format("DD/MM/YYYY"),
    },
    {
      label: "Regular",
      field: "regular",
    },
    {
      label: "Overtime",
      field: "overtime",
    },
    {
      label: "Paid Leave",
      field: "leave",
    },
    {
      label: "Status",
      field: "status",
      renderCell: ({ status }) => (
        <Chip
          icon={<CheckIcon />}
          label={status}
          color={status === "approved" ? "primary" : "secondary"}
        />
      ),
    },
  ];

  return <TableComponent columns={columns} data={data || []} />;
};

const types = {
  FETCH_PAYROLL_HOURS_REQUEST: "FETCH_PAYROLL_HOURS_REQUEST",
  FETCH_PAYROLL_HOURS_SUCCESS: "FETCH_PAYROLL_HOURS_SUCCESS",
  FETCH_PAYROLL_HOURS_FAILURE: "FETCH_PAYROLL_HOURS_FAILURE",
};
const initialState = {
  isLoading: false,
  payrollHours: [],
  error: null,
};
const reducer = (state, action) => {
  const { type, payload, error } = action;
  // eslint-disable-next-line default-case
  switch (type) {
    case types.FETCH_PAYROLL_HOURS_REQUEST:
      return { ...state, isLoading: true, error: null };
    case types.FETCH_PAYROLL_HOURS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        payrollHours: payload,
      };
    case types.FETCH_PAYROLL_HOURS_FAILURE:
      return { ...state, isLoading: false, error };
  }
};

const PayrollHoursView = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const handleExportClick = async () => {
    if (state.payrollHours.length > 0) {
      const rows = state.payrollHours.map(
        ({
          employee,
          fromDate,
          toDate,
          regular,
          overtime,
          leave,
          ...rest
        }) => ({
          startDate: new Date(fromDate).toLocaleDateString(),
          endDate: new Date(toDate).toLocaleDateString(),
          regular: `${regular} hrs`,
          overtime: `${overtime} hrs`,
          leave: `${leave} hrs`,
          ...rest,
        })
      );

      const filename = `Payroll Hours ${moment().format("DD-MM-YYYY")}`;

      const columns = [
        {
          label: "Employee",
          field: "employeeName",
        },
        {
          label: "Start Date",
          field: "startDate",
        },
        {
          label: "End Date",
          field: "endDate",
        },
        {
          label: "Regular",
          field: "regular",
        },
        {
          label: "Overtime",
          field: "overtime",
        },
        {
          label: "Paid Leave",
          field: "leave",
        },
        {
          label: "Status",
          field: "status",
        },
      ];
      await makeExcel(getTableDataForExport(rows, columns), filename);
    }
  };

  const [filters, setFilters] = React.useState("");

  const handleFilterChange = () => (e) => {
    const { value } = e.target;
    setFilters(value);
  };
  const fetchPayrollHours = React.useCallback(async (fromDate, toDate) => {
    try {
      dispatch({ type: types.FETCH_PAYROLL_HOURS_REQUEST });
      const { success, payrollHours, error } =
        await API.payroll.getPayrollHours({ query: { fromDate, toDate } });
      if (success) {
        dispatch({
          type: types.FETCH_PAYROLL_HOURS_SUCCESS,
          payload: payrollHours,
        });
      } else {
        dispatch({ type: types.FETCH_PAYROLL_HOURS_FAILURE, error });
      }
    } catch (e) {
      const error = "Something went wrong.";
      dispatch({ type: types.FETCH_PAYROLL_HOURS_FAILURE, error });
    }
  }, []);

  React.useEffect(() => {
    fetchPayrollHours(filters.from, filters.to);
  }, [fetchPayrollHours, filters.from, filters.to]);

  return (
    <PageView
      backPath={"/app/reports"}
      title={"Payroll hours"}
      icon={
        <span style={{ verticalAlign: "middle" }}>
          <PayrollHoursIcon fontSize="large" />
        </span>
      }
      actions={[
        {
          label: "Export to Excel",
          icon: { node: <ExportIcon /> },
          position: "right",
          handler: handleExportClick,
          otherProps: {
            color: "primary",
            variant: "outlined",
            size: "small",
          },
        },
      ]}
    >
      <PayrollHoursFilterbar
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <Box mt={2} />

      {state.isLoading ? (
        <LoadingComponent />
      ) : state.error ? (
        <ErrorBoxComponent
          error={state.error}
          onRetry={() => fetchPayrollHours(filters.from, filters.to)}
        />
      ) : (
        state.payrollHours && (
          <PayrollHoursTable
            // eslint-disable-next-line array-callback-return
            data={(state.payrollHours || []).filter((payrollHour) => {
              try {
                const { employeeName } = payrollHour;

                const isEmployeeNameMatched = employeeName
                  .toLowerCase()
                  .includes(filters.toLowerCase());

                return isEmployeeNameMatched;
              } catch (error) {
                console.error(error);
              }
            })}
          />
        )
      )}
    </PageView>
  );
};

export default PayrollHoursView;
