import React from "react";
import NextLight from "../assets/icons/navigate_next-light.svg";
import NextDark from "../assets/icons/navigate_next-dark.svg";
import BeforeLight from "../assets/icons/navigate_before-light.svg";
import BeforeDark from "../assets/icons/navigate_before-dark.svg";

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { daysOfWeek: ["شنبه", "یک", "دو", "سه", "چهار", "پنج", "جمعه"] };
  }
  e2a(s) {
    return s.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
  }
  e2p(s) {
    return s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  }
  render() {
    return (
      <React.Fragment>
        <div id="calendar-header">
          <img
            onClick={(e) => this.props.monthChangeHandler(e)}
            id={this.props.getClassName("previous")}
            src={this.props.theme === "dark" ? BeforeDark : BeforeLight}
            alt="previous"
          />
          <div id={this.props.getClassName("calendar-header-details")}>
            <p id="calendar-header-jalali">{this.e2p(this.props.currentMonth.header.jalali)}</p>
            <div id="secandary-header-details">
              <p id="calendar-header-miladi">{this.props.currentMonth.header.miladi}</p>
              <p id="calendar-header-qamari">{this.e2a(this.props.currentMonth.header.qamari)}</p>
            </div>
            <p
              className={
                this.props.isItToday() ? this.props.getClassName("back-to-today-disabled") : null
              }
              id={this.props.getClassName("back-to-today")}
              onClick={this.props.backToTodayHandler}
            >
              {this.props.isItToday() ? null : "برو به "}
              امروز
            </p>
          </div>
          <img
            onClick={(e) => this.props.monthChangeHandler(e)}
            id={this.props.getClassName("next")}
            src={this.props.theme === "dark" ? NextDark : NextLight}
            alt="next"
          />
        </div>
        <hr className="divider" />
        <div id="calendar-main">
          {this.state.daysOfWeek.map((dayOfWeek, i) => {
            return (
              <p className={this.props.getClassName("days-of-week")} key={i}>
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
                    ? this.props.getClassName("disabled")
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
                    ? this.props.getClassName("today")
                    : !day.disabled
                    ? "day" + String(day.day.j)
                    : null
                }
                onClick={!day.disabled ? (e) => this.props.daysClickHandler(e) : null}
              >
                <p className="jalali">{this.e2p(day.day.j)}</p>
                <div className="secandary-day">
                  <span className="miladi">{day.day.m}</span>
                  <span className="qamari">{this.e2a(day.day.q)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <hr className="divider" />
        <div id="calendar-footer">
          {this.props.todayEvents.length === 0 ? (
            <p id={this.props.getClassName("no-event")}>.رویدادی برای نمایش وجود ندارد</p>
          ) : (
            this.props.todayEvents.map((event, i) => {
              return (
                <p className={this.props.getClassName("events")} key={i}>
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
