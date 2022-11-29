// const combineReducers = (reducers) => {
//   return (state, action) => {
//     return Object.keys(reducers).reduce((acc, prop) => {
//       return {
//         ...acc,
//         ...reducers[prop]({ [prop]: acc[prop] }, action),
//       };
//     }, state);
//   };
// };

export function combineReducers(reducers) {
  // First get an array with all the keys of the reducers (the reducer names)
  const reducerKeys = Object.keys(reducers);

  return function combination(state = {}, action) {
    // This is the object we are going to return.
    const nextState = {};

    // Loop through all the reducer keys
    for (let i = 0; i < reducerKeys.length; i++) {
      // Get the current key name
      const key = reducerKeys[i];
      // Get the current reducer
      const reducer = reducers[key];
      // Get the the previous state
      const previousStateForKey = state[key];
      // Get the next state by running the reducer
      const nextStateForKey = reducer(previousStateForKey, action);
      // Update the new state for the current reducer
      nextState[key] = { ...previousStateForKey, ...nextStateForKey };
    }
    return { ...state, ...nextState };
  };
}

let authContext = require("./auth/Context");
let configContext = require("./config/Context");
let localeContext = require("./locale/Context");
let onlineContext = require("./online/Context");
let orgContext = require("./org/Context");
let themeContext = require("./theme/Context");

if (process.env.NODE_ENV !== "production") {
  module.hot.accept(authContext, () => {
    authContext = require("./auth/Context");
  });
  module.hot.accept(configContext, () => {
    configContext = require("./config/Context");
  });
  module.hot.accept(localeContext, () => {
    localeContext = require("./locale/Context");
  });
  module.hot.accept(onlineContext, () => {
    onlineContext = require("./online/Context");
  });
  module.hot.accept(orgContext, () => {
    orgContext = require("./org/Context");
  });
  module.hot.accept(themeContext, () => {
    themeContext = require("./theme/Context");
  });
}
