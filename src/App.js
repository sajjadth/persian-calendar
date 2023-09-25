import "./App.sass";
import React from "react";
import { connect } from "react-redux";
import Error from "./components/error";
import Loading from "./components/loading";
import { p2e, getClassName } from "./selectors";
import Calendar from "./components/calendar/calnedar";
import {
  actionsBeforeMounting,
  getData,
  getTodayEvents,
  handleResize,
} from "./reducer/calendarSlice";

class App extends React.Component {
  render() {
    const { loading, error, theme } = this.props.calendar;
    return (
      <div id={getClassName(theme, "main")}>
        {loading ? <Loading /> : error ? <Error /> : <Calendar />}
      </div>
    );
  }

  componentDidMount() {
    const params = window.location.search.slice(1, window.location.search.length).split("&");
    const date = new Date().toLocaleDateString("fa-IR").split("/");
    window.addEventListener("resize", () => {
      this.props.handleResize();
    });
    this.props
      .getData(p2e(new Date().toLocaleDateString("fa-IR", { year: "numeric" })))
      .then(() => {
        this.props.actionsBeforeMounting({ params: params, date: date });
        this.props.handleResize();
      });
  }
}

const mapStateToProps = (state) => {
  return {
    calendar: state.calendar,
  };
};
const mapDispatchToProps = {
  actionsBeforeMounting,
  getData,
  getTodayEvents,
  handleResize,
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
