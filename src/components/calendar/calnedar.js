import React from "react";
import MonthView from "./monthView";
class Calendar extends React.Component {
  render() {
    return (
      <React.Fragment>
        <MonthView
          theme={this.props.theme}
          selectedDay={this.props.selectedDay}
          todayEvents={this.props.todayEvents}
          currentMonth={this.props.currentMonth}
          isItToday={this.props.isItToday}
          fixEventText={this.props.fixEventText}
          getClassName={this.props.getClassName}
          isTodayHoliday={this.props.isTodayHoliday}
          monthChangeHandler={this.props.monthChangeHandler}
          backToTodayHandler={this.props.backToTodayHandler}
          daysClickHandler={this.props.daysClickHandler}
          selectedDayStyle={this.props.selectedDayStyle}
          getTodayEvents={this.props.getTodayEvents}
          day={this.props.day}
        />
      </React.Fragment>
    );
  }
}

export default Calendar;
