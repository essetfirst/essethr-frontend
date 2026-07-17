import React from "react";
import PropTypes from "prop-types";
import { Box, Paper, Tabs, Tab, Typography, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box pt={3}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const TabShell = styled(Paper)(({ theme }) => ({
  borderRadius: 10,
  border: `1px solid ${theme.palette.mode === "light" ? alpha("#0f172a", 0.08) : alpha("#fff", 0.08)}`,
  overflow: "hidden",
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 44,
  borderBottom: `1px solid ${theme.palette.divider}`,
  "& .MuiTab-root": {
    minHeight: 44,
    padding: theme.spacing(1, 2),
  },
}));

const getSelectedTabIndex = (tabs) => {
  const idx = tabs.findIndex((tab) => tab.selected);
  return idx >= 0 ? idx : 0;
};

const TabbedComponent = ({ title, tabs, variant, appBarProps, tabsProps, tabIndex, onTabChange }) => {
  const [selectedTab, setSelectedTab] = React.useState(() =>
    tabIndex != null ? tabIndex : getSelectedTabIndex(tabs),
  );

  const selectedFromProps = tabs.findIndex((tab) => tab.selected);

  React.useEffect(() => {
    if (tabIndex != null) {
      setSelectedTab(tabIndex);
    } else if (selectedFromProps >= 0) {
      setSelectedTab(selectedFromProps);
    }
  }, [tabIndex, selectedFromProps]);

  const handleChange = (_event, newSelectedTab) => {
    setSelectedTab(newSelectedTab);
    onTabChange?.(newSelectedTab);
  };

  const tabList = tabs.map(({ label }, index) => (
    <Tab key={label} label={label} id={`tab-${index}`} aria-controls={`tabpanel-${index}`} />
  ));

  const panelList = tabs.map(({ label, panel }, index) => (
    <TabPanel key={label} value={selectedTab} index={index}>
      <Box px={{ xs: 2, sm: 3 }} pb={3}>
        {panel}
      </Box>
    </TabPanel>
  ));

  const tabHeaderList = (
    <StyledTabs
      variant="scrollable"
      scrollButtons="auto"
      value={selectedTab}
      onChange={handleChange}
      aria-label="tabs"
      {...tabsProps}
    >
      {tabList}
    </StyledTabs>
  );

  if (variant === "appBar") {
    return (
      <Box>
        {title && (
          <Typography variant="h5" fontWeight={600} mb={2}>
            {title}
          </Typography>
        )}
        <Paper {...appBarProps}>{tabHeaderList}</Paper>
        {panelList}
      </Box>
    );
  }

  return (
    <Box>
      {title && (
        <Typography variant="h5" fontWeight={600} mb={2}>
          {title}
        </Typography>
      )}
      <TabShell elevation={0}>
        {tabHeaderList}
        {panelList}
      </TabShell>
    </Box>
  );
};

TabbedComponent.propTypes = {
  title: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      panel: PropTypes.node,
      selected: PropTypes.bool,
    }),
  ).isRequired,
  variant: PropTypes.oneOf(["appBar", "paper"]),
  appBarProps: PropTypes.object,
  tabsProps: PropTypes.object,
  tabIndex: PropTypes.number,
  onTabChange: PropTypes.func,
};

export default TabbedComponent;
