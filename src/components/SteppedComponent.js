import React from "react";
import PropTypes from "prop-types";

import clsx from "clsx";

import {
  makeStyles,
  // withStyles,
  Button,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  // StepConnector,
  
} from "@material-ui/core";

import { Check } from "react-feather";

// const QontoConnector = withStyles({
//   alternativeLabel: {
//     top: 10,
//     left: "calc(-50% + 16px)",
//     right: "calc(50% + 16px)",
//   },
//   active: {
//     "& $line": {
//       borderColor: "#784af4",
//     },
//   },
//   completed: {
//     "& $line": {
//       borderColor: "#784af4",
//     },
//   },
//   line: {
//     borderColor: "#eaeaf0",
//     borderTopWidth: 3,
//     borderRadius: 1,
//   },
// })(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
  },
  active: {
    color: "#784af4",
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  completed: {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  contentArea: {
    padding: theme.spacing(1, 2),
  },
  content: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

const SteppedComponent = ({
  steps,
  finishPage,
  orientation,
  previousButtonLabel,
  nextButtonLabel,
  completeButtonLabel,
}) => {
  const classes = useStyles();
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

  let stepLabels = [],
    stepContents = [];
  steps.forEach(({ label, icon, content }) => {
    stepLabels.push(
      <Step key={label}>
        <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
      </Step>
    );
    stepContents.push(content);
  });

  return (
    <Paper className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={orientation === "vertical" ? 4 : 12}>
          <Stepper
            alternativeLabel
            activeStep={activeStep}
            orientation={orientation}
          >
            {/* {steps.map(({ label, icon: Element, content }) => (
          <Step key={label}>
            <StepLabel icon={<DefaultIcon />}>{label}</StepLabel>
          </Step>
        ))} */}
            {stepLabels}
          </Stepper>
        </Grid>
        <Grid item xs={orientation === "vertical" ? 8 : 12}>
          {activeStep === steps.length ? (
            finishPage ? (
              finishPage
            ) : (
              <div className={classes.resetContainer}>
                <Typography className={classes.instructions}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button onClick={handleReset} className={classes.button}>
                  Reset
                </Button>
              </div>
            )
          ) : (
            <div className={classes.contentArea}>
              <div className={classes.content}>{stepContents[activeStep]}</div>

              <div className={classes.actionsContainer}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.button}
                >
                  {previousButtonLabel || "Previous"}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1
                    ? completeButtonLabel || "Complete"
                    : nextButtonLabel || "Next"}
                </Button>
              </div>
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

SteppedComponent.propTypes = {
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      content: PropTypes.node.isRequired,
    })
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
