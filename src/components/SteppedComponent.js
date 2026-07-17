import React from "react";
import PropTypes from "prop-types";

import { Button, Grid, Paper, Stepper, Step, StepLabel, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { Check } from "react-feather";

const StepIconRoot = styled("div")(({ ownerState }) => ({
  color: ownerState.active || ownerState.completed ? "#784af4" : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
}));

const StepIconCircle = styled("div")({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: "currentColor",
});

const StepIconCompleted = styled(Check)({
  color: "#784af4",
  zIndex: 1,
  fontSize: 18,
});

function QontoStepIcon(props) {
  const { active, completed } = props;

  return (
    <StepIconRoot ownerState={{ active, completed }}>
      {completed ? <StepIconCompleted /> : <StepIconCircle />}
    </StepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
};

const StyledRoot = styled(Paper)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginRight: theme.spacing(1),
}));

const StyledActionsContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
}));

const StyledInstructions = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const StyledContentArea = styled("div")(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

const StyledContent = styled("div")(({ theme }) => ({
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const StyledResetContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(3),
}));

const SteppedComponent = ({
  steps,
  finishPage,
  orientation,
  previousButtonLabel,
  nextButtonLabel,
  completeButtonLabel,
}) => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const stepLabels = [];
  const stepContents = [];
  steps.forEach(({ label, content }) => {
    stepLabels.push(
      <Step key={label}>
        <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
      </Step>,
    );
    stepContents.push(content);
  });

  return (
    <StyledRoot>
      <Grid container spacing={1}>
        <Grid item xs={orientation === "vertical" ? 4 : 12}>
          <Stepper
            alternativeLabel
            activeStep={activeStep}
            orientation={orientation}
          >
            {stepLabels}
          </Stepper>
        </Grid>
        <Grid item xs={orientation === "vertical" ? 8 : 12}>
          {activeStep === steps.length ? (
            finishPage || (
              <StyledResetContainer>
                <StyledInstructions>
                  All steps completed - you&apos;re finished
                </StyledInstructions>
                <StyledButton onClick={handleReset}>Reset</StyledButton>
              </StyledResetContainer>
            )
          ) : (
            <StyledContentArea>
              <StyledContent>{stepContents[activeStep]}</StyledContent>

              <StyledActionsContainer>
                <StyledButton
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  {previousButtonLabel || "Previous"}
                </StyledButton>
                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1
                    ? completeButtonLabel || "Complete"
                    : nextButtonLabel || "Next"}
                </StyledButton>
              </StyledActionsContainer>
            </StyledContentArea>
          )}
        </Grid>
      </Grid>
    </StyledRoot>
  );
};

SteppedComponent.propTypes = {
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      content: PropTypes.node.isRequired,
    }),
  ).isRequired,
  finishPage: PropTypes.node,
  previousButtonLabel: PropTypes.string,
  nextButtonLabel: PropTypes.string,
  completeButtonLabel: PropTypes.string,
};

SteppedComponent.defaultProps = {
  orientation: "horizontal",
};

export default SteppedComponent;
