import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

import Page from "components/Page";
import SteppedComponent from "components/SteppedComponent";
import { generatePayrunSchema } from "features/payroll/schemas/generatePayrunSchema";

import EmployeeSelectionPanel from "./EmployeeSelectionPanel";
import GeneratePayrollDetailsPanel from "./GeneratePayrollDetailsPanel";
import SubmitPanel from "./SubmitPanel";

const StyledRoot = styled(Page)(({ theme }) => ({
  backgroundColor: theme.palette.background.dark,
    height: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
}));

const GeneratePayrunView = ({ employees }) => {

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(generatePayrunSchema),
    defaultValues: {
      title: "",
      employees: [],
      from: startOfMonth.toISOString().slice(0, 10),
      to: endOfMonth.toISOString().slice(0, 10),
      payDate: endOfMonth.toISOString().slice(0, 10),
      payType: "daily",
    },
  });

  const values = watch();

  const onSubmit = (formValues) => {
    console.log(formValues);
  };

  const handleGenerate = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <StyledRoot title="Generate Payrun">
      <Box height="100%" display="flex" flexDirection="column">
        <Container>
          <SteppedComponent
            steps={[
              {
                label: "Specify payment period",
                content: (
                  <GeneratePayrollDetailsPanel register={register} errors={errors} />
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
                      setValue("employees", selected, { shouldValidate: true });
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
          {errors.employees?.message && (
            <Box mt={1} color="error.main" component="p">
              {errors.employees.message}
            </Box>
          )}
        </Container>
      </Box>
    </StyledRoot>
  );
};

export default GeneratePayrunView;
