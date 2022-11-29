import React from "react";

import {
  Box,
  Chip,
  // CircularProgress,
  // LinearProgress,
  TextField,
  Typography,
} from "@material-ui/core";

import {
  Payment as PayrollHoursIcon,
  CheckCircleOutlineOutlined as CheckIcon,
  // Error as ErrorIcon,
} from "@material-ui/icons";

import { Download as ExportIcon } from "react-feather";

import Chart from "react-apexcharts";

import { getTableDataForExport, makeExcel } from "../../../helpers/export";

import {
  CURRENT_MONTH_END_DATE,
  CURRENT_MONTH_START_DATE,
} from "../../../constants";

import API from "../../../api";

// import arrayToMap from "../../../utils/arrayToMap";

import PageView from "../../../components/PageView";
import LoadingComponent from "../../../components/LoadingComponent";
import ErrorBoxComponent from "../../../components/ErrorBoxComponent";
import CircularProgressWithLabel from "../../../components/CircularProgressWithLabel";

import Searchbar from "../../../components/common/Searchbar";
import Table from "../../../components/TableComponent";

// import PAYROLL_DATE_HOURS from "./data";

const FilterFields = ({ filters, onFilterFieldChange }) => {
  return (
    <Box display="flex" alignItems={"center"}>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        type="date"
        label="From"
        name="from"
        onChange={onFilterFieldChange}
        value={filters.from}
        style={{ marginRight: "8px" }}
      />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="To"
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

const RadialChartWithLabel = ({ height = 50, data }) => {
  const labels = data.map((d) => d.label),
    colors = data.map((d) => d.color) || ["#4CAF50"],
    values = data.map((d) => d.value);

  return (
    <Chart
      height={50}
      options={{
        chart: {
          background: "transparent",
          stacked: false,
          toolbar: {
            show: false,
          },
        },
        fill: { opacity: 1 },
        labels,
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                show: true,
                color: "#65748B",
                fontSize: "12px",
                fontWeight: 400,
                offsetY: 20,
              },
              value: {
                color: "#121828",
                fontSize: "18px",
                fontWeight: 600,
                offsetY: -20,
              },
            },
            hollow: {
              size: "60%",
            },
            track: { background: "#F9FAFC" },
          },
        },
        states: {
          active: {
            filter: { type: "none", value: 0 },
          },
          hover: {
            filter: { type: "none", value: 0 },
          },
        },
        theme: {
          mode: "light",
        },
        colors,
      }}
      series={values}
      type="radialBar"
      width="100%"
    />
  );
};

const PayrollHoursTable = ({ data }) => {
  const columns = [
    {
      label: "Employee",
      field: "employee",
      renderCell: ({ employeeName }) => (
        <Typography variant="h6">{employeeName}</Typography>
      ),
    },
    {
      label: "Period",
      align: "center",

      renderCell: ({ fromDate, toDate }) => (
        <>
          <Typography variant="h6" component="span">{`${fromDate}`}</Typography>
          <Typography variant="body2" component="span">
            {" "}
            to{" "}
          </Typography>
          <Typography variant="h6" component="span">{`${toDate}`}</Typography>
        </>
      ),
    },
    {
      label: "Regular",
      field: "regular",
      align: "center",
      renderCell: ({ regular }) => (
        <>
          <Typography variant="h6">{`${
            regular > 0 ? regular + " hrs" : regular
          }`}</Typography>
          {/* <RadialChartWithLabel
            height={50}
            data={[
              {
                label: "Regular Hours",
                color: regular > 20 ? "#347cfd" : "#18ac23",
                value: regular,
              },
            ]}
          /> */}
        </>
      ),
    },
    {
      label: "Overtime",
      field: "overtime",
      align: "center",
      renderCell: ({ overtime }) => (
        <>
          <Typography variant="h6">{`${
            overtime > 0 ? overtime + " hrs" : overtime
          }`}</Typography>
        </>
      ),
    },
    {
      label: "Paid Leave",
      field: "leave",
      align: "center",
      renderCell: ({ leave }) => (
        <>
          <Typography variant="h6">{`${
            leave > 0 ? leave + " hrs" : leave
          }`}</Typography>

          {/* {leave <= 0 ? (
            <Typography variant="h6">{leave + " hrs"}</Typography>
          ) : (
            <CircularProgressWithLabel
              variant="determinate"
              disableShrink
              value={leave}
              caption={" hrs"}
              thickness={4}
            />
          )} */}

          {/* <LinearProgress variant="determinate" thickness={2} value={leave} /> */}
        </>
      ),
    },
    {
      label: "Approved?",
      field: "status",
      align: "center",
      renderCell: ({ status }) =>
        status === "approved" ? (
          <CheckIcon color={"primary"} />
        ) : (
          <Chip size="small" label={String(status).toLocaleLowerCase()} />
        ),
    },
  ];
  return <Table size="small" columns={columns} data={data} />;
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
      const filename = `Payroll hours report (${new Date(
        filters.from
      ).toLocaleDateString()} to ${new Date(filters.to).toLocaleDateString()})`;

      const rows = state.payrollHours.map(
        ({
          employee,
          employeeId,
          fromDate,
          toDate,
          regular,
          overtime,
          leave,
          ...rest
        }) => ({
          employeeId: employee.employeeId,
          startDate: new Date(fromDate).toLocaleDateString(),
          endDate: new Date(toDate).toLocaleDateString(),
          regular: `${regular} hrs`,
          overtime: `${overtime} hrs`,
          leave: `${leave} hrs`,
          ...rest,
        })
      );
      const columns = [
        {
          label: "Id",
          field: "employeeId",
        },
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

  const [filters, setFilters] = React.useState({
    searchTerm: "",
    department: "",
    from: CURRENT_MONTH_START_DATE,
    to: CURRENT_MONTH_END_DATE,
  });
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const fetchPayrollHours = React.useCallback(async (fromDate, toDate) => {
    try {
      dispatch({ type: types.FETCH_PAYROLL_HOURS_REQUEST });
      const { success, payrollHours, error } =
        await API.payroll.getPayrollHours({ query: { fromDate, toDate } });
      if (success) {
        // console.log("Payroll hours: ", payrollHours);
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
    // console.log("State: ", state);
    fetchPayrollHours(filters.from, filters.to);
  }, [filters.from, filters.to]);

  return (
    <PageView
      backPath={"/app/reports"}
      title={"Payroll hours"}
      icon={
        <span style={{ verticalAlign: "middle" }}>
          <PayrollHoursIcon fontSize="medium" />
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
            variant: "text",
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
        state.payrollHours && <PayrollHoursTable data={state.payrollHours} />
      )}
    </PageView>
  );
};

export default PayrollHoursView;
