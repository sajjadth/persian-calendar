import React from "react";
import { connect } from "react-redux";
import DateNavigationButton from "../dateNavigationButton";
import styles from "../../styles/verticalWeekView.module.sass";
import {
  getClassName,
  p2e,
  isItToday,
  isTodayHoliday,
  yearChangesInWeekChangeHandler,
} from "../../selectors";
import { getData, daysClickHandler, backToTodayHandler } from "../../reducer/calendarSlice";

class VerticalWeekView extends React.Component {
  getDayClassName(day) {
    const { theme } = this.props.calendar;
    const themeClass = styles[getClassName(theme, "day")];
    const holidayClass =
      day.events.isHoliday && isTodayHoliday(this.props.calendar, day.day.jalali)
        ? styles["todayHoliday"]
        : day.events.isHoliday
        ? styles["holiday"]
        : "";

    return `${themeClass} ${holidayClass}`.trim();
  }
  daysSelectedStyleHandler(e) {
    const { selectedDayStyle, theme } = this.props.calendar;
    const { daysClickHandler } = this.props;
    daysClickHandler(e);
    const id = `day${e}`;
    const d = document.getElementById(id);
    if (d) {
      if (!selectedDayStyle) d.classList.add(styles[getClassName(theme, "selected")]);
      else {
        document
          .getElementById(`day${selectedDayStyle}`)
          .classList.remove(styles[getClassName(theme, "selected")]);
        d.classList.add(styles[getClassName(theme, "selected")]);
      }
    } else {
      document
        .getElementById(`day${selectedDayStyle}`)
        .classList.remove(styles[getClassName(theme, "selected")]);
    }
  }
  backToTodayHandler = () => {
    const { selectedDayStyle, theme, selectedYear, year } = this.props.calendar;
    const { backToTodayHandler, getData } = this.props;
    if (selectedDayStyle)
      document
        .getElementById(`day${selectedDayStyle}`)
        .classList.remove(styles[getClassName(theme, "selected")]);
    if (selectedYear !== year) getData(year);
    backToTodayHandler();
  };
  weekChangeHandler(e) {
    const { selectedYear, theme, selectedDayStyle } = this.calendar;
    const { getData, weekChangeHandler } = this;
    if (selectedDayStyle)
      document
        .getElementById(`day${selectedDayStyle}`)
        .classList.remove(styles[getClassName(theme, "selected")]);
    if (yearChangesInWeekChangeHandler(this.calendar, e)) {
      getData(e === "next" ? selectedYear + 1 : selectedYear - 1);
      weekChangeHandler(e);
    } else weekChangeHandler(e);
  }
  render() {
    const { theme, currentMonth, todayEvents, daysOfWeekLong, weekStartIndex, weekEndIndex } =
      this.props.calendar;
    return (
      <React.Fragment>
        <div id={styles[getClassName(theme, "calendar")]}>
          <DateNavigationButton direction="next" handler={this.weekChangeHandler} />
          <div id={styles[getClassName(theme, "calendarMain")]}>
            {daysOfWeekLong.map((d, i) => {
              const day = currentMonth.days.slice(weekStartIndex, weekEndIndex)[i];
              return (
                <button
                  key={i}
                  className={this.getDayClassName(day)}
                  disabled={day.disabled}
                  id={
                    !day.disabled && isTodayHoliday(this.props.calendar, day.day.jalali)
                      ? styles[getClassName(theme, "today")]
                      : !day.disabled
                      ? "day" + String(p2e(day.day.jalali))
                      : null
                  }
                  onClick={
                    !day.disabled
                      ? () => {
                          this.daysSelectedStyleHandler(p2e(day.day.jalali));
                        }
                      : null
                  }
                >
                  <p className={styles[getClassName(theme, "daysOfWeek")]}>{d}</p>
                  <p className={styles["jalali"]}>{day.day.jalali}</p>
                  <p className={styles["miladi"]}>{day.day.gregorian}</p>
                  <p className={styles["qamari"]}>{day.day.hijri}</p>
                </button>
              );
            })}
          </div>
          <div id={styles["calendarHeaderParent"]}>
            <div id={styles[getClassName(theme, "calendarHeader")]}>
              <div id={styles[getClassName(theme, "calendarHeaderDetails")]}>
                <p id={styles["calendarHeaderJalali"]}>{currentMonth.header.jalali}</p>
                <div id={styles["secandaryHeaderDetails"]}>
                  <p id={styles["calendarHeaderMiladi"]}>{currentMonth.header.gregorian}</p>
                  <p id={styles["calendarHeaderQamari"]}>{currentMonth.header.hijri}</p>
                </div>
                <p
                  className={
                    isItToday(this.props.calendar)
                      ? styles[getClassName(theme, "backToTodayDisabled")]
                      : null
                  }
                  id={styles[getClassName(theme, "backToToday")]}
                  onClick={this.backToTodayHandler}
                >
                  {isItToday(this.props.calendar) ? null : "برو به "}
                  امروز
                </p>
              </div>
            </div>
          </div>
          <div id={styles[getClassName(theme, "calendarFooter")]}>
            {todayEvents.length === 0 ? (
              <p id={styles[getClassName(theme, "noEvent")]}>.رویدادی برای نمایش وجود ندارد</p>
            ) : (
              todayEvents.map((e, i) => {
                return (
                  <p className={styles[getClassName(theme, "events")]} key={i}>
                    {e.event}
                    {e.isHoliday ? <span className={styles["redText"]}> (تعطیل)</span> : null}
                  </p>
                );
              })
            )}
          </div>
          <DateNavigationButton direction="previous" handler={this.weekChangeHandler} />
        </div>
      </React.Fragment>
    );
  }
  componentDidUpdate() {
    let ok = false;
    const { getDataStatus } = this.props.calendar;
    const { onChangeMonthCheckForEvents } = this.props;
    if (getDataStatus === "pending") ok = true;
    if (ok && getDataStatus === "fulfilled") onChangeMonthCheckForEvents();
  }
}

const mapStateToProps = (state) => {
  return { calendar: state.calendar };
};
const mapDispatchToProps = {
  getData,
  daysClickHandler,
  backToTodayHandler,
};
export default connect(mapStateToProps, mapDispatchToProps)(VerticalWeekView);
