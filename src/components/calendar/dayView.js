import React from "react";
import { connect } from "react-redux";
import styles from "../../styles/dayView.module.sass";
import { getClassName } from "../../selectors";

class DayView extends React.Component {
  render() {
    const { theme, currentMonth, day, todayEvents } = this.props.calendar;
    const today = currentMonth.days[currentMonth.startIndex - 1 + day];
    const todayGregorian = `${today.day.gregorian} ${currentMonth.header.gregorian}`;
    const todayHijri = `${today.day.hijri} ${currentMonth.header.hijri}`;
    return (
      <React.Fragment>
        <div id={styles[getClassName(theme, "calendar")]}>
          <div id={styles[getClassName(theme, "calendarHeader")]}>
            <div id={styles[getClassName(theme, "mainJalali")]}>
              <div id={styles[getClassName(theme, "weekdayAndDay")]}>
                <p
                  className={
                    today.events.isHoliday
                      ? styles["todayHoliday"]
                      : styles[getClassName(theme, "today")]
                  }
                  id={styles["mainJalaliDay"]}
                >
                  {today.day.jalali}
                </p>
                <p id={styles[getClassName(theme, "weekday")]}>
                  {new Date().toLocaleDateString("fa-IR", { weekday: "long" })}
                </p>
              </div>
              <p id={styles["mainJalaliTitle"]}>{currentMonth.header.jalali}</p>
            </div>
            <div id={styles[getClassName(theme, "calendarHeaderDetails")]}>
              <p id={styles["calendarHeaderMiladi"]}>{todayGregorian}</p>
              <p id={styles["calendarHeaderQamari"]}>{todayHijri}</p>
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
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return { calendar: state.calendar };
};
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(DayView);
