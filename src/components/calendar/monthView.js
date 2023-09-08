import React from "react";
import { connect } from "react-redux";
import styles from "../../styles/monthView.module.sass";
import NextDark from "../../assets/icons/navigate-next-dark.svg";
import NextLight from "../../assets/icons/navigate-next-light.svg";
import BeforeDark from "../../assets/icons/navigate-before-dark.svg";
import BeforeLight from "../../assets/icons/navigate-before-light.svg";
import { getClassName, p2e, isItToday, isTodayHoliday } from "../../selectors";
import {
  backToTodayHandler,
  daysClickHandler,
  monthChangeHandler,
  getData,
} from "../../reducer/calendarSlice";

class MonthView extends React.Component {
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
  backToTodayHandler() {
    const { selectedDayStyle, theme, selectedYear, year } = this.props.calendar;
    const { backToTodayHandler, getData } = this.props;
    if (selectedDayStyle)
      document
        .getElementById(`day${selectedDayStyle}`)
        .classList.remove(styles[getClassName(theme, "selected")]);
    if (selectedYear !== year) getData(year);
    backToTodayHandler();
  }
  monthChangeStyleHandler(e) {
    const { selectedDayStyle, theme, selectedMonth, selectedYear } = this.props.calendar;
    const { monthChangeHandler, getData } = this.props;

    if (selectedDayStyle)
      document
        .getElementById(`day${selectedDayStyle}`)
        .classList.remove(styles[getClassName(theme, "selected")]);
    if (e === "next" && selectedMonth === 12) getData(selectedYear + 1);
    if (e === "previous" && selectedMonth === 1) getData(selectedYear - 1);
    monthChangeHandler(e);
  }
  render() {
    const { theme, currentMonth, todayEvents, daysOfWeek } = this.props.calendar;
    return (
      <React.Fragment>
        <div id={styles[getClassName(theme, "calendar")]}>
          <div id={styles["calendarHeader"]}>
            <img
              onClick={() => this.monthChangeStyleHandler("next")}
              id={styles[getClassName(theme, "next")]}
              src={theme === "dark" ? NextDark : NextLight}
              alt="next"
            />
            <div id={styles[getClassName(theme, "calendarHeaderDetails")]}>
              <p id={styles["calendarHeaderJalali"]}>{currentMonth.header.jalali}</p>
              <div id={styles["secandaryHeaderDetails"]}>
                <p id={styles["calendarHeaderMiladi"]}>{currentMonth.header.gregorian}</p>
                <p id={styles["calendarHeaderQamari"]}>{currentMonth.header.hijri}</p>
              </div>
              <p
                className={
                  styles[
                    isItToday(this.props.calendar)
                      ? getClassName(theme, "backToTodayDisabled")
                      : null
                  ]
                }
                id={styles[getClassName(theme, "backToToday")]}
                onClick={() => this.backToTodayHandler()}
              >
                {isItToday(this.props.calendar) ? null : "برو به "}
                امروز
              </p>
            </div>
            <img
              onClick={() => this.monthChangeStyleHandler("previous")}
              id={styles[getClassName(theme, "previous")]}
              src={theme === "dark" ? BeforeDark : BeforeLight}
              alt="previous"
            />
          </div>
          <hr className={styles["divider"]} />
          <div id={styles["calendarMain"]}>
            {daysOfWeek.map((dayOfWeek, i) => {
              return (
                <p className={styles[getClassName(theme, "daysOfWeek")]} key={i}>
                  {dayOfWeek}
                </p>
              );
            })}
            {currentMonth.days.map((day, i) => {
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
                  <p className={styles["jalali"]}>{day.day.jalali}</p>
                  <div className={styles["secandaryDay"]}>
                    <span className={styles["miladi"]}>{day.day.gregorian}</span>
                    <span className={styles["qamari"]}>{day.day.hijri}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <hr className={styles["divider"]} />
          <div id={styles["calendarFooter"]}>
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
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return { calendar: state.calendar };
};
const mapDispatchToProps = {
  backToTodayHandler,
  daysClickHandler,
  monthChangeHandler,
  getData,
};
export default connect(mapStateToProps, mapDispatchToProps)(MonthView);
