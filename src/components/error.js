import React from "react";
import { connect } from "react-redux";
import { p2e, getClassName } from "../selectors";
import styles from "../styles/error.module.sass";
import { actionsBeforeMounting, getData } from "../reducer/calendarSlice";

class Error extends React.Component {
  constructor(props) {
    super(props);
    this.retryHandler = this.retryHandler.bind(this);
  }
  retryHandler() {
    console.log(this);
    setTimeout(() => {
      this.props.getData(p2e(new Date().toLocaleDateString("fa-IR", { year: "numeric" })));
      const params = window.location.search.slice(1, window.location.search.length).split("&");
      const date = new Date().toLocaleDateString("fa-IR").split("/");
      this.props.actionsBeforeMounting({ params: params, date: date });
    }, 200);
  }
  render() {
    const { theme } = this.props.calendar;
    return (
      <div id={styles[getClassName(theme,"error")]}>
        <lord-icon
          src="https://cdn.lordicon.com/bmnlikjh.json"
          trigger="loop"
          colors="primary:#FF3B30"
          style={{ width: "75px", height: "75px" }}
        ></lord-icon>
        <p id={styles[getClassName(theme, "errorMessage")]}>
          متأسفانه یک مشکل ناخواسته رخ داده است.
          <br />
          لطفاً دوباره امتحان کنید.
        </p>
        <lord-icon
          id={styles["retry"]}
          src="https://cdn.lordicon.com/akuwjdzh.json"
          trigger="click"
          colors={theme === "dark" ? "primary:#E0E0E0" : "primary:#0A0A0A"}
          state="hover"
          style={{ width: "25px", height: "25px" }}
          onClick={this.retryHandler}
        ></lord-icon>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { calendar: state.calendar };
};
const mapDispatchToProps = { actionsBeforeMounting, getData };

export default connect(mapStateToProps, mapDispatchToProps)(Error);
