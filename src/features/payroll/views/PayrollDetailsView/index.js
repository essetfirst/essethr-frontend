import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { useParams } from "react-router-dom";
import PaymentIcon from "@mui/icons-material/Payment";
import { Download as ExportIcon, Printer as PrintIcon } from "react-feather";
import { getTableDataForExport, makeExcel } from "helpers/export";
import { useSnackbar } from "notistack";

import API from "api";
import usePermissions from "features/auth/hooks/usePermissions";
import { PERMISSIONS } from "constants/permissions";

import PageView from "components/PageView";
import LoadingComponent from "components/LoadingComponent";
import ErrorBoxComponent from "components/ErrorBoxComponent";

import PayrollMetadata from "./PayrollMetadata";
import PayslipList from "./PayslipList";
import PayrollAdjustmentsPanel from "./PayrollAdjustmentsPanel";
import PayrollValidationPanel from "./PayrollValidationPanel";
import PayrollComparisonPanel from "./PayrollComparisonPanel";

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
  const { enqueueSnackbar } = useSnackbar();
  const { can } = usePermissions();

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

  const payroll = state.payroll;
  const canLock =
    can(PERMISSIONS.PAYROLL_WRITE) &&
    payroll &&
    !payroll.locked &&
    payroll.status !== "finalized";
  const canFinalize =
    can(PERMISSIONS.PAYROLL_APPROVE) &&
    payroll &&
    payroll.status !== "finalized";

  const handleLock = async () => {
    const res = await API.payroll.lock(payrollId);
    if (res?.success) {
      enqueueSnackbar("Payroll locked.", { variant: "success" });
      fetchPayroll();
    } else {
      enqueueSnackbar(res?.error || "Lock failed.", { variant: "error" });
    }
  };

  const handleFinalize = async () => {
    const res = await API.payroll.finalize(payrollId);
    if (res?.success) {
      enqueueSnackbar("Payroll finalized.", { variant: "success" });
      fetchPayroll();
    } else {
      enqueueSnackbar(res?.error || "Finalize failed.", { variant: "error" });
    }
  };

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

  const actions = [];
  if (canLock) {
    actions.push({
      label: "Lock",
      position: "left",
      handler: handleLock,
      otherProps: {
        variant: "outlined",
        color: "secondary",
        size: "small",
      },
    });
  }
  if (canFinalize) {
    actions.push({
      label: "Finalize",
      position: "left",
      handler: handleFinalize,
      otherProps: {
        variant: "contained",
        color: "primary",
        size: "small",
      },
    });
  }
  actions.push(
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
    }
  );

  return (
    <PageView
      title={"Payroll Details"}
      backPath={"/app/payroll"}
      icon={<PaymentIcon />}
      actions={actions}
    >
      {state.requesting ? (
        <LoadingComponent />
      ) : state.error ? (
        <ErrorBoxComponent error={state.error} onRetry={handleRetry} />
      ) : (
        state.payroll && (
          <>
            <PayrollValidationPanel payrollId={payrollId} />
            <PayrollComparisonPanel payrollId={payrollId} />
            <PayrollMetadata metadata={metadata} />
            {can(PERMISSIONS.PAYROLL_WRITE) && (
              <PayrollAdjustmentsPanel payrollId={payrollId} onSuccess={fetchPayroll} />
            )}
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
