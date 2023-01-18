import React from "react";
import PropTypes from "prop-types";

import {
  makeStyles,
  AppBar,
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Divider,
} from "@material-ui/core";

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
      {value === index && (
        <Box pb={3} pt={3}>
          {children}
        </Box>
      )}
    </div>
  );
};
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const TabbedComponent = ({ title, tabs, variant, appBarProps, tabsProps }) => {
  const classes = useStyles();

  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleChange = (e, newSelectedTab) => setSelectedTab(newSelectedTab);

  let tabList = [],
    panelList = [];
  tabs.forEach(({ label, panel, selected }, index) => {
    if (selected) setSelectedTab(index);
    tabList.push(
      <Tab
        style={{ display: "flex", justifyContent: "flex-start", padding: 0 }}
        key={label}
        index={index}
        label={label}
        id={`tab-${index}`}
        aria-controls={`tabpanel-${index}`}
      />
    );
    panelList.push(
      <TabPanel key={label} value={selectedTab} index={index}>
        {panel}
      </TabPanel>
    );
  });

  const tabHeaderList = (
    <Tabs
      variant="scrollable"
      value={selectedTab}
      onChange={handleChange}
      aria-label="tabs"
      {...tabsProps}
    >
      {tabList}
    </Tabs>
  );

  return (
    <>
      <Box className={classes.root}>
        {title && <Typography variant="h5">{title}</Typography>}
        {variant === undefined || !variant ? (
          <Box>
            {tabHeaderList}
            <Divider />
          </Box>
        ) : variant === "appBar" ? (
          <AppBar position="static" color="primary" {...appBarProps}>
            {tabHeaderList}
          </AppBar>
        ) : (
          <Paper square>{tabHeaderList}</Paper>
        )}
        {panelList}
      </Box>
    </>
  );
};

TabbedComponent.propTypes = {
  title: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      panel: PropTypes.node,
      selected: PropTypes.bool,
    })
  ).isRequired,
  variant: PropTypes.oneOf(["appBar", "paper"]),
  appBarProps: PropTypes.shape({
    position: PropTypes.oneOf([
      "absolute",
      "fixed",
      "relative",
      "static",
      "sticky",
    ]),
    color: PropTypes.oneOf([
      "default",
      "inherit",
      "primary",
      "secondary",
      "transparent",
    ]),
  }),
  tabsProps: PropTypes.shape({
    indicatorColor: PropTypes.oneOf(["primary", "secondary"]),
    textColor: PropTypes.oneOf(["inherit", "primary", "secondary"]),
  }),
};

export default TabbedComponent;
