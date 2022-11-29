import React from "react";
import Context from "./Context";

const withContainer = (Component) => {
  const ChildComponent = (props) => {
    return (
      <Context.Consumer>
        {({ locale, setLocale }) => (
          <Component locale={locale} setLocale={setLocale} {...props} />
        )}
      </Context.Consumer>
    );
  };

  return ChildComponent;
};

export default withContainer;
