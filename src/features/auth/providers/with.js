import React from "react";

import Context from "./Context";

const withContainer = (Component) => {
  const ChildComponent = (props) => {
    return (
      <Context.Consumer>
        {({ auth, login, logout }) => (
          <Component auth={auth} login={login} logout={logout} {...props} />
        )}
      </Context.Consumer>
    );
  };
  return ChildComponent;
};

export default withContainer;
