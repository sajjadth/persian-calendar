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
  getAnimationClassName(dir, view) {
    if (view === "vertical-week") {
      return dir + "Animation" + "VerticalWeek";
    }
    return dir + "Animation";
  }
  handler(e) {
    const { theme, view } = this.props.calendar;
    e === "next"
      ? document
          .getElementById(styles[getClassName(theme, "next")])
          .classList.add(styles[this.getAnimationClassName("next", view)])
      : document
          .getElementById(styles[getClassName(theme, "previous")])
          .classList.add(styles[this.getAnimationClassName("previous", view)]);
    setTimeout(() => {
      e === "next"
        ? document
            .getElementById(styles[getClassName(theme, "next")])
            .classList.remove(styles[this.getAnimationClassName("next", view)])
        : document
            .getElementById(styles[getClassName(theme, "previous")])
            .classList.remove(styles[this.getAnimationClassName("previous", view)]);
    }, 250);
    this.props.handler(e);
  }
  capitalizeFirstLetter(str) {
    let output = "";
    str.split("-").forEach((s) => (output += s.charAt(0).toUpperCase() + s.slice(1)));
    return output;
  }

  render() {
    const { theme, view } = this.props.calendar;
    const { direction } = this.props;
    return (
      <img
        id={styles[getClassName(theme, direction)]}
        className={styles[direction + this.capitalizeFirstLetter(view)]}
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
