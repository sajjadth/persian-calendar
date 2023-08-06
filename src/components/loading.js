import React from "react";
import "../styles/loading.sass";

class Loading extends React.Component {
  render() {
    return (
      <div id="loading">
        <span id="loading-dot-1"></span>
        <span id="loading-dot-2"></span>
        <span id="loading-dot-3"></span>
      </div>
    );
  }
}

export default Loading;
