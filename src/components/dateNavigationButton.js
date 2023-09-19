import { Component } from "react";
import { connect } from "react-redux";
import { getClassName } from "../selectors";
import NextDark from "../assets/icons/navigate-next-dark.svg";
import NextLight from "../assets/icons/navigate-next-light.svg";
import styles from "../styles/dateNavigationButton.module.sass";
import BeforeDark from "../assets/icons/navigate-before-dark.svg";
import BeforeLight from "../assets/icons/navigate-before-light.svg";
import { getData, weekChangeHandler } from "../reducer/calendarSlice";

class DateNavigationButton extends Component {
  handler(e) {
    const { theme } = this.props.calendar;
    e === "next"
      ? document
          .getElementById(styles[getClassName(theme, "next")])
          .classList.add(styles["nextAnimation"])
      : document
          .getElementById(styles[getClassName(theme, "previous")])
          .classList.add(styles["previousAnimation"]);
    setTimeout(() => {
      e === "next"
        ? document
            .getElementById(styles[getClassName(theme, "next")])
            .classList.remove(styles["nextAnimation"])
        : document
            .getElementById(styles[getClassName(theme, "previous")])
            .classList.remove(styles["previousAnimation"]);
    }, 250);
    this.props.handler(e);
  }
  render() {
    const { theme } = this.props.calendar;
    const { direction } = this.props;
    return (
      <img
        id={styles[getClassName(theme, direction)]}
        onClick={() => this.handler(direction)}
        src={
          direction === "next"
            ? theme === "dark"
              ? NextDark
              : NextLight
            : theme === "dark"
            ? BeforeDark
            : BeforeLight
        }
        alt={direction === "next" ? "next" : "previous"}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return { calendar: state.calendar };
};
const mapDispatchToProps = {
  getData,
  weekChangeHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(DateNavigationButton);
