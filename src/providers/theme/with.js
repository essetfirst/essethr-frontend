import React from "react";
import Context from "./Context";

const withContainer = (Component) => {
  const ChildComponent = (props) => {
    return (
      <Context.Consumer>
        {({ darkMode, toggleDarkMode }) => (
          <Component
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            {...props}
          />
        )}
      </Context.Consumer>
    );
  };

  return ChildComponent;
};

export default withContainer;
