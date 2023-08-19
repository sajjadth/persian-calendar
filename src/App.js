import "./App.sass";
import React from "react";
import { connect } from "react-redux";
import Error from "./components/error";
import Loading from "./components/loading";
import { p2e, getClassName } from "./selectors";
import Calendar from "./components/calendar/calnedar";
import { actionsBeforeMounting, getData, getTodayEvents } from "./reducer/calendarSlice";

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
    this.props.getData(p2e(new Date().toLocaleDateString("fa-IR", { year: "numeric" })));
    const params = window.location.search.slice(1, window.location.search.length).split("&");
    const date = new Date().toLocaleDateString("fa-IR").split("/");
    this.props.actionsBeforeMounting({ params: params, date: date });
  }
}

const mapStateToProps = (state) => {
  return {
    calendar: state.calendar,
  };
};
const mapDispatchToProps = { actionsBeforeMounting, getData, getTodayEvents };
export default connect(mapStateToProps, mapDispatchToProps)(App);
