import React, { Component } from 'react';
import "../src/Styles/ErrorBoundary.css"
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong.</h1>
          <p>We're sorry, but an unexpected error has occurred. Please try again later.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
