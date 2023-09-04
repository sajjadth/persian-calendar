import React from "react";
import MonthView from "./monthView";
import HorizontalWeekView from "./horizontalWeekView";
import { connect } from "react-redux";
import DayView from "./dayView";

class Calendar extends React.Component {
  render() {
    const { view } = this.props.calendar;
    return (
      <React.Fragment>
        {view === "month" ? (
          <MonthView />
        ) : view === "horizontal-week" ? (
          <HorizontalWeekView />
        ) : view === "day" ? (
          <DayView/>
        ) : null}
      </React.Fragment>
    );
  }
}

const mapStateToPRops = (state) => {
  return { calendar: state.calendar };
};
export default connect(mapStateToPRops, {})(Calendar);
