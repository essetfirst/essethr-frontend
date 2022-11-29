import React from "react";

const withPrintability = (Component, ref) => {
  return class extends React.Component {
    render() {
      return <Component ref={ref} {...this.props} />;
    }
  };
};

export default withPrintability;
