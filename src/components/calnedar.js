import React from "react";
import NextLight from "../assets/icons/navigate_next-light.svg";
import NextDark from "../assets/icons/navigate_next-dark.svg";
import BeforeLight from "../assets/icons/navigate_before-light.svg";
import BeforeDark from "../assets/icons/navigate_before-dark.svg";

class Calendar extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div id="calendar-header">
          <img
            onClick={(e) => this.props.monthChangeHandler(e)}
            id={"previous-" + this.props.theme}
            src={this.props.theme === "dark" ? BeforeDark : BeforeLight}
            alt="previous"
          />
          <div id={"calendar-header-details-" + this.props.theme}>
            <p id="calendar-header-jalali">
              {this.props.e2p(this.props.currentMonth.header.jalali)}
            </p>
            <div id="secandary-header-details">
              <p id="calendar-header-miladi">{this.props.currentMonth.header.miladi}</p>
              <p id="calendar-header-qamari">
                {this.props.e2a(this.props.currentMonth.header.qamari)}
              </p>
            </div>
            <p
              className={
                this.props.isItToday() ? "back-to-today-disabled-" + this.props.theme : null
              }
              id={"back-to-today-" + this.props.theme}
              onClick={this.props.backToTodayHandler}
            >
              {this.props.isItToday() ? null : "برو به "}
              امروز
            </p>
          </div>
          <img
            onClick={(e) => this.props.monthChangeHandler(e)}
            id={"next-" + this.props.theme}
            src={this.props.theme === "dark" ? NextDark : NextLight}
            alt="next"
          />
        </div>
        <hr className="divider" />
        <div id="calendar-main">
          {this.props.daysOfWeek.map((dayOfWeek, i) => {
            return (
              <p className={"days-of-week-" + this.props.theme} key={i}>
                {dayOfWeek}
              </p>
            );
          })}
          {this.props.currentMonth.weeks.map((day, i) => {
            return (
              <div
                key={i}
                className={
                  day.disabled
                    ? "disabled-" + this.props.theme
                    : `day-${this.props.theme}
                        ${
                          this.props.eventsOfMonth.includes(Number(day.day.j)) &&
                          this.props.isTodayHoliday(Number(day.day.j))
                            ? "today-holiday"
                            : this.props.eventsOfMonth.includes(Number(day.day.j))
                            ? "holiday"
                            : null
                        }`
                }
                id={
                  !day.disabled && this.props.isTodayHoliday(Number(day.day.j))
                    ? "today-" + this.props.theme
                    : !day.disabled
                    ? "day" + String(day.day.j)
                    : null
                }
                onClick={!day.disabled ? (e) => this.props.daysClickHandler(e) : null}
              >
                <p className="jalali">{this.props.e2p(day.day.j)}</p>
                <div className="secandary-day">
                  <span className="miladi">{day.day.m}</span>
                  <span className="qamari">{this.props.e2a(day.day.q)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <hr className="divider" />
        <div id="calendar-footer">
          {this.props.todayEvents.length === 0 ? (
            <p id={"no-event-" + this.props.theme}>.رویدادی برای نمایش وجود ندارد</p>
          ) : (
            this.props.todayEvents.map((event, i) => {
              return (
                <p className={"events-" + this.props.theme} key={i}>
                  {this.props.fixEventText(event)}
                  {event.isHoliday ? <span className="red-text"> (تعطیل)</span> : null}
                </p>
              );
            })
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Calendar;
