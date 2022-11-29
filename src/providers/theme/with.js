import React from "react";
import Context from "./Context";

const withContainer = (Component) => {
  const ChildComponent = (props) => {
    return (
      <Context.Consumer>
        {({ theme, setTheme }) => (
          <Component theme={theme} setTheme={setTheme} {...props} />
        )}
      </Context.Consumer>
    );
  };

  return ChildComponent;
};

export default withContainer;
