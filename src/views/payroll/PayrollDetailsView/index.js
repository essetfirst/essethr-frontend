import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { useParams } from "react-router-dom";
import PaymentIcon from "@material-ui/icons/Payment";
import { Download as ExportIcon, Printer as PrintIcon } from "react-feather";
import { getTableDataForExport, makeExcel } from "../../../helpers/export";

import API from "../../../api";

import PageView from "../../../components/PageView";
import LoadingComponent from "../../../components/LoadingComponent";
import ErrorBoxComponent from "../../../components/ErrorBoxComponent";

import PayrollMetadata from "./PayrollMetadata";
import PayslipList from "./PayslipList";

const types = {
  REQUESTING: "REQUESTING",
  REQUEST_SUCCESS: "REQUEST_SUCCESS",
  REQUEST_ERROR: "REQUEST_ERROR",
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

const PayrollDetailsView = () => {
  const params = useParams();
  const payrollId = params.id;

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const fetchPayroll = React.useCallback(() => {
    dispatch({ type: types.REQUESTING });
    API.payroll
      .getById(payrollId)
      .then(({ success, payroll, error }) => {
        success
          ? dispatch({ type: types.REQUEST_SUCCESS, payload: payroll })
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
  }, [payrollId]);

  useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  const handleExportClick = async () => {

    const columns = [
      {
        label: "Title",
        field: "title",
      },
      {
        label: "Pay Date",
        field: "payDate",
      },
      {
        label: "Total Payment",
        field: "totalPayment",
      },
      {
        label: "From Date",
        field: "fromDate",
      },
      {
        label: "To Date",
        field: "toDate",
      },
    ];

    const rows = [state.payroll].map((payroll) => ({
      title: payroll.title,
      payDate: payroll.payDate,
      totalPayment: payroll.totalPayment,
      fromDate: payroll.fromDate,
      toDate: payroll.toDate,
    }));

    const tableData = getTableDataForExport(rows, columns);
    const fileName = `${state.payroll.title}`;
    await makeExcel(tableData, fileName);
  };

  const handleRetry = () => {
    fetchPayroll();
  };

  const { payslips, ...metadata } = state.payroll || {};

  return (
    <PageView
      title={"Payroll Details"}
      backPath={"/app/payroll"}
      icon={<PaymentIcon />}
      actions={[
        {
          label: "Approve",
          position: "left",
          otherProps: {
            variant: "contained",
            color: "primary",
            size: "small",
            disabled: state.payrolls,
          },
        },
        {
          label: "Export",
          position: "right",
          handler: handleExportClick,
          icon: { node: <ExportIcon /> },
          otherProps: { size: "small", disabled: !state.payroll },
        },
        {
          label: "Print",
          icon: { node: <PrintIcon /> },
          position: "right",
          otherProps: { size: "small", disabled: !state.payroll },
        },
      ]}
    >
      {state.requesting ? (
        <LoadingComponent />
      ) : state.error ? (
        <ErrorBoxComponent error={state.error} onRetry={handleRetry} />
      ) : (
        state.payroll && (
          <>
            <PayrollMetadata metadata={metadata} />
            <PayslipList payslips={payslips} />
          </>
        )
      )}
    </PageView>
  );
};

PayrollDetailsView.propTypes = {
  className: PropTypes.string,
};

export default PayrollDetailsView;
