import React from "react";

import Context from "./Context";

const withContainer = (Component) => {
  const ChildComponent = (props) => {
    return (
      <Context.Consumer>
        {(value) => {
          return <Component isOnline={value} {...props} />;
        }}
      </Context.Consumer>
    );
  };

  return ChildComponent;
};

export default withContainer;
