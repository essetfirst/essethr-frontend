import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Box, Button, ButtonGroup, Container, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Page from "../Page";
import BreadcrumbsNav from "../BreadcrumbsNav";
import PageSkeleton from "../PageSkeleton";

const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const TitleRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
}));

const ActionsBar = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const PageView = ({
  backPath,
  icon,
  title,
  pageTitle,
  actions = [],
  breadcrumbs = false,
  loading = false,
  children,
}) => {
  const navigate = useNavigate();

  const leftActions = [];
  const rightActions = [];
  actions.forEach(({ type, label, icon: actionIcon, handler, position, otherProps }) => {
    const { node: IconNode } = actionIcon || {};
    const action =
      type === "icon-button" ? (
        <IconButton onClick={handler} key={label} aria-label={label} {...otherProps}>
          {actionIcon.node}
        </IconButton>
      ) : (
        <Button
          key={label}
          onClick={handler}
          aria-label={label}
          endIcon={
            actionIcon && actionIcon.position === "end" && actionIcon.node ? IconNode : undefined
          }
          startIcon={actionIcon?.node ? IconNode : undefined}
          {...otherProps}
          size="small"
          variant={otherProps?.variant || "outlined"}
        >
          {label}
        </Button>
      );
    if (position === "right") {
      rightActions.push(action);
    } else {
      leftActions.push(action);
    }
  });

  React.useEffect(() => {
    document.scrollingElement?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Page title={pageTitle || title} sx={{ minHeight: "100%", bgcolor: "background.default" }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <PageHeader>
          {breadcrumbs && (
            <Box mb={1}>
              <BreadcrumbsNav />
            </Box>
          )}
          <TitleRow>
            {backPath && (
              <IconButton
                onClick={() => navigate(backPath)}
                size="small"
                aria-label="Go back"
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: 1.5,
                }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
            {icon && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "primary.main",
                  "& .MuiSvgIcon-root": { fontSize: 22 },
                }}
              >
                {icon}
              </Box>
            )}
            <Typography variant="h3" component="h1" fontWeight={700}>
              {title}
            </Typography>
          </TitleRow>
          {(leftActions.length > 0 || rightActions.length > 0) && (
            <ActionsBar>
              <ButtonGroup variant="outlined" size="small">
                {leftActions}
              </ButtonGroup>
              <ButtonGroup variant="outlined" size="small">
                {rightActions}
              </ButtonGroup>
            </ActionsBar>
          )}
        </PageHeader>
        {loading ? <PageSkeleton /> : children}
      </Container>
    </Page>
  );
};

PageView.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  pageTitle: PropTypes.string,
  backPath: PropTypes.string,
  breadcrumbs: PropTypes.bool,
  loading: PropTypes.bool,
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
    }),
  ),
  children: PropTypes.node,
};

export default PageView;
