import React from "react";
import PropTypes from "prop-types";
import FormikFormFields from "../../../../components/common/FormikFormFields";
import { leaveFormFields } from "./leaveFormFields";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Typography,
} from "@material-ui/core";

const LeaveFormDialog = ({
  open,
  onClose,
  action,
  leave,
  state,
  onSubmit,
  employees,
  leaveTypes,
}) => {
  const employeeOptions = [
    { label: "Choose employee", value: -1 },
    ...employees,
  ];
  const leaveTypeOptions = [
    { label: "Choose leaveTypes", value: -1 },
    ...leaveTypes,
  ];

  // const durationOptions = [
  //   { label: "Choose duration", value: -1 },
  //   ...durations,
  // ];

  const handleDialogClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };

  const computeDateDiff = (d1, d2) => {
    return (
      Math.abs(new Date(d1).getTime() - new Date(d2).getTime()) / (24 * 3600000)
    );
  };

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogContent>
        <Box height="100%" p={2} justifyContent="center">
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            style={{ fontFamily: "Poppins" }}
          >
            {action === "register" ? "Register Leave" : "Update Leave"}
          </Typography>
          <Divider />
          <FormikFormFields
            initialValues={leave ? leave : null}
            formFields={leaveFormFields({
              employeeOptions,
              leaveTypeOptions,
            })}
            submitActionButtonLabel={
              state.isLoading ? (
                <CircularProgress size={24} color="secondary" />
              ) : action === "register" ? (
                "Register Leave"
              ) : (
                "Update Leave"
              )
            }
            onSubmit={(values, { resetForm }) => {
              try {
                if (action === "register") {
                  onSubmit({
                    ...values,
                    duration: computeDateDiff(values.startDate, values.endDate),
                  });
                } else {
                  onSubmit({
                    ...values,
                    duration: computeDateDiff(values.startDate, values.endDate),
                  });
                }
              } catch (error) {
                console.error(error);
              }
            }}
            onCancel={handleDialogClose}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

LeaveFormDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  action: PropTypes.string,
  state: PropTypes.object,
  leave: PropTypes.object,
  employees: PropTypes.array,
  leaveTypes: PropTypes.array,
  durations: PropTypes.array,
  onSubmit: PropTypes.func,
  submitActionButtonLabel: PropTypes.string,
};

export default LeaveFormDialog;
