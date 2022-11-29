import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    this.setState({ ...this.state, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: 20,
            color: "#fa2345",
          }}
        >
          <h1>Something went wrong. Dont worry we will try again!</h1>
          {/* <p>{(this.state.errorInfo || {}).componentStack}</p> */}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
