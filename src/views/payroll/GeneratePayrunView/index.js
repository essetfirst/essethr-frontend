import React from "react";

import { useNavigate } from "react-router-dom";

import { Formik } from "formik";
import * as Yup from "yup";

import { Box, Container, makeStyles } from "@material-ui/core";

import Page from "../../../components/Page";
import SteppedComponent from "../../../components/SteppedComponent";

import EmployeeSelectionPanel from "./EmployeeSelectionPanel";
import GeneratePayrollDetailsPanel from "./GeneratePayrollDetailsPanel";
import SubmitPanel from "./SubmitPanel";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const GeneratePayrunView = ({ employees }) => {
  //   const [selectedEmployees, setSelectedEmployees] = React.useState([]);
  //   const [period, setPeriod] = React.useState({ from: "", to: "", payDate: "" });

  //  const handleSelectionChange = (selected) => setSelectedEmployees(selected);
  //   const handlePeriodChange = (e) => {
  //     const { name, value } = e.target;
  //     setPeriod({ ...period, [name]: value });
  //   };
  const classes = useStyles();
  const navigate = useNavigate();

  const handleGenerate = (e) => {
    // Do the fetch here
    // const values = { employees: selectedEmployees, ...period };
    // onGenerate(values);
  };

  // const handleGenerateSubmit = (e) => {
  //   navigate("/payrun", { state: { employees: [], fromDate: "", toDate: "" } });
  // };

  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1
  );
  return (
    <Page className={classes.root} title="Generate Payrun">
      <Box height="100%" display="flex" flexDirection="column">
        <Container>
          <Formik
            initialValues={{
              title: "",
              employees: [],
              from: startOfMonth.toISOString().slice(0, 10),
              to: endOfMonth.toISOString().slice(0, 10),
              payDate: endOfMonth.toISOString().slice(0, 10),
              payType: "daily",
            }}
            validationSchema={Yup.object({
              title: Yup.string().max(
                40,
                "Make your title 40 characters or less"
              ),
              employees: Yup.array().min(1, "Select at least one employee"),
              from: Yup.date()
                .max(new Date(), "Select start date only from the past")
                .required(),
              to: Yup.date()
                .max(new Date(), "Select end date only from the past")
                .required(),
              payDate: Yup.date().min(
                new Date(),
                "Select pay date only from the future"
              ),
              payType: Yup.string().oneOf(["daily", "hourly"]).default("daily"),
            })}
            onSubmit={(values) => console.log(values)}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              handleReset,
              isSubmitting,
            }) => (
              <SteppedComponent
                steps={[
                  {
                    label: "Specify payment period",
                    content: (
                      <GeneratePayrollDetailsPanel
                        formProps={{
                          values,
                          errors,
                          touched,
                          onBlur: handleBlur,
                          onChange: handleChange,
                        }}
                      />
                    ),
                  },
                  {
                    label: "Select employees",
                    content: (
                      <EmployeeSelectionPanel
                        employees={
                          employees || [
                            { id: 1, name: "Abraham Gebrekidan" },
                            { id: 2, name: "Anteneh Tesfaye" },
                          ]
                        }
                        onSelectionChange={(selected) => {
                          handleChange({
                            target: { name: "employees", value: selected },
                          });
                        }}
                      />
                    ),
                  },
                ]}
                finishPage={
                  <SubmitPanel
                    values={values}
                    onSubmit={handleGenerate}
                    submitButtonLabel="Generate"
                  />
                }
                previousButtonLabel="Back"
                nextButtonLabel="Proceed"
                completeButtonLabel="Submit"
              />
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default GeneratePayrunView;
