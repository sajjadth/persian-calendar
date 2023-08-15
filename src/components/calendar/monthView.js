import React from "react";
import styles from "../../styles/monthView.module.sass";
import NextDark from "../../assets/icons/navigate_next-dark.svg";
import NextLight from "../../assets/icons/navigate_next-light.svg";
import BeforeDark from "../../assets/icons/navigate_before-dark.svg";
import BeforeLight from "../../assets/icons/navigate_before-light.svg";

class MonthView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { daysOfWeek: ["شنبه", "یک", "دو", "سه", "چهار", "پنج", "جمعه"] };
  }
  p2e = (s) => String(s).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  getDayClassName(day) {
    const { getClassName, isTodayHoliday } = this.props;

    const themeClass = styles[getClassName("day")];

    const holidayClass =
      day.events.isHoliday && isTodayHoliday(day.day.jalali)
        ? styles["todayHoliday"]
        : day.events.isHoliday
        ? styles["holiday"]
        : "";

    return `${themeClass} ${holidayClass}`.trim();
  }
  daysSelectedStyleHandler(e) {
    const id = `day${e}`;
    const day = document.getElementById(id);
    if (day) {
      console.log(this.props.selectedDayStyle);
      if (!this.props.selectedDayStyle)
        day.classList.add(styles[this.props.getClassName("selected")]);
      else {
        document
          .getElementById(`day${this.props.selectedDayStyle}`)
          .classList.remove(styles[this.props.getClassName("selected")]);
        day.classList.add(styles[this.props.getClassName("selected")]);
      }
    } else {
      document
        .getElementById(`day${this.props.selectedDayStyle}`)
        .classList.remove(styles[this.props.getClassName("selected")]);
    }
  }
  backToTodayHandler() {
    if (this.props.selectedDayStyle)
      document
        .getElementById(`day${this.props.selectedDayStyle}`)
        .classList.remove(styles[this.props.getClassName("selected")]);
    this.props.backToTodayHandler();
  }
  monthChangeHandler(e) {
    if (this.props.selectedDayStyle)
      document
        .getElementById(`day${this.props.selectedDayStyle}`)
        .classList.remove(styles[this.props.getClassName("selected")]);
    this.props.monthChangeHandler(e);
    if (this.props.isItToday()) this.props.getTodayEvents(this.props.day);
  }
  render() {
    return (
      <React.Fragment>
        <div id={styles[this.props.getClassName("calendar")]}>
          <div id={styles["calendarHeader"]}>
            <img
              onClick={() => this.monthChangeHandler("previous")}
              id={styles[this.props.getClassName("previous")]}
              src={this.props.theme === "dark" ? BeforeDark : BeforeLight}
              alt="previous"
            />
            <div id={styles[this.props.getClassName("calendarHeaderDetails")]}>
              <p id={styles["calendarHeaderJalali"]}>{this.props.currentMonth.header.jalali}</p>
              <div id={styles["secandaryHeaderDetails"]}>
                <p id={styles["calendarHeaderMiladi"]}>
                  {this.props.currentMonth.header.gregorian}
                </p>
                <p id={styles["calendarHeaderQamari"]}>{this.props.currentMonth.header.hijri}</p>
              </div>
              <p
                className={
                  styles[
                    this.props.isItToday() ? this.props.getClassName("backToTodayDisabled") : null
                  ]
                }
                id={styles[this.props.getClassName("backToToday")]}
                onClick={() => this.backToTodayHandler()}
              >
                {this.props.isItToday() ? null : "برو به "}
                امروز
              </p>
            </div>
            <img
              onClick={() => this.monthChangeHandler("next")}
              id={styles[this.props.getClassName("next")]}
              src={this.props.theme === "dark" ? NextDark : NextLight}
              alt="next"
            />
          </div>
          <hr className={styles["divider"]} />
          <div id={styles["calendarMain"]}>
            {this.state.daysOfWeek.map((dayOfWeek, i) => {
              return (
                <p className={styles[this.props.getClassName("daysOfWeek")]} key={i}>
                  {dayOfWeek}
                </p>
              );
            })}
            {this.props.currentMonth.days.map((day, i) => {
              return (
                <button
                  key={i}
                  className={this.getDayClassName(day)}
                  disabled={day.disabled}
                  id={
                    !day.disabled && this.props.isTodayHoliday(day.day.jalali)
                      ? styles[this.props.getClassName("today")]
                      : !day.disabled
                      ? "day" + String(this.p2e(day.day.jalali))
                      : null
                  }
                  onClick={
                    !day.disabled
                      ? () => {
                          this.props.daysClickHandler(this.p2e(day.day.jalali));
                          this.daysSelectedStyleHandler(this.p2e(day.day.jalali));
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
            {this.props.todayEvents.length === 0 ? (
              <p id={styles[this.props.getClassName("noEvent")]}>.رویدادی برای نمایش وجود ندارد</p>
            ) : (
              this.props.todayEvents.map((e, i) => {
                return (
                  <p className={styles[this.props.getClassName("events")]} key={i}>
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

export default MonthView;
