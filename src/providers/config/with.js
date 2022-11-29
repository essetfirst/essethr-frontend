import React from "react";

import Context from "./Context";

import config from "../../config";
import merge from "../../utils/merge";

const withContainer = (Component) => {
  return (ChildComponent = (props) => {
    return (
      <Context.Consumer>
        {({ value }) => {
          const { appConfig } = value || {};
          return <Component appConfig={merge(config, appConfig)} {...props} />;
        }}
      </Context.Consumer>
    );
  });
};

export default withContainer;
