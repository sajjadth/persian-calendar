import React from "react";

class Error extends React.Component {
  render() {
    return (
      <div id="error">
        <lord-icon
          src="https://cdn.lordicon.com/bmnlikjh.json"
          trigger="loop"
          colors="primary:#FF3B30"
          style={{ width: "75px", height: "75px" }}
        ></lord-icon>
        <p id={"error-message-" + this.props.theme}>{this.props.errorMessage}</p>
        <lord-icon
          id="retry"
          src="https://cdn.lordicon.com/akuwjdzh.json"
          trigger="click"
          colors={this.props.theme === "dark" ? "primary:#E0E0E0" : "primary:#0A0A0A"}
          state="hover"
          style={{ width: "25px", height: "25px" }}
          onClick={this.props.retryHandler}
        ></lord-icon>
      </div>
    );
  }
}

export default Error;
