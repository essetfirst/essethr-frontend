import React from "react";
import PropTypes from "prop-types";

import { useNavigate } from "react-router";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";

import Page from "../Page";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    paddingTop: theme.spacing(1),
    fontFamily: "Poppins",
  },
}));

const PageView = ({
  backPath,
  icon,
  title,
  pageTitle,
  actions = [],
  children,
}) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(backPath);
  };

  const leftActions = [];
  const rightActions = [];
  actions.forEach(({ type, label, icon, handler, position, otherProps }) => {
    const { node: IconNode } = icon || {};
    const action =
      type === "icon-button" ? (
        <IconButton
          onClick={handler}
          key={label}
          aria-label={label}
          {...otherProps}
        >
          {icon.node}
        </IconButton>
      ) : (
        <Button
          key={label}
          onClick={handler}
          aria-label={label}
          {...{
            endIcon:
              icon &&
              icon.position &&
              icon.position === "end" &&
              icon.node &&
              IconNode,
            startIcon: icon && icon.node && IconNode,
          }}
          {...otherProps}
          size="small"
        >
          {label}
        </Button>
      );
    if (position && position === "right") {
      rightActions.push(action);
    } else {
      leftActions.push(action);
    }
  });

  React.useEffect(() => {
    document.scrollingElement.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <Page className={classes.root} title={pageTitle || title}>
      <ReactCSSTransitionGroup
        transitionAppear={true}
        transitionAppearTimeout={600}
        transitionEnterTimeout={600}
        transitionLeaveTimeout={200}
        transitionName={"SlideOut"}
      >
        <Box display="flex" flexDirection="column" height="100%">
          <Container>
            <Typography
              variant="h3"
              color="textSecondary"
              gutterBottom
              className={classes.root}
            >
              {backPath && (
                <IconButton
                  variant="outlined"
                  onClick={handleBackClick}
                  size="small"
                >
                  <ArrowBackIosIcon style={{ fontSize: "1.4rem" }} />
                </IconButton>
              )}{" "}
              <span style={{ verticalAlign: "middle" }}> {icon}</span> {title}
            </Typography>
            <Box mb={1} />
            <Box display="flex" justifyContent="space-between">
              <ButtonGroup> {leftActions}</ButtonGroup>
              <ButtonGroup>{rightActions}</ButtonGroup>
            </Box>
            <Box mb={2} />
            {children}
          </Container>
        </Box>
      </ReactCSSTransitionGroup>
    </Page>
  );
};

PageView.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["button", "icon-button", "link"]),
      label: PropTypes.string.isRequired,
      handler: PropTypes.func,
      icon: PropTypes.shape({
        node: PropTypes.node,
        position: PropTypes.oneOf(["start", "end"]),
      }),
      position: PropTypes.oneOf(["left", "right"]),
      buttonProps: PropTypes.object,
    })
  ),
  children: PropTypes.node,
};

export default PageView;
