export const getClassName = (t, name) => {
  const theme = t.slice(0, 1).toUpperCase() + t.slice(1, t.length).toLowerCase();
  return `${name}${theme}`;
};
export const p2e = (s) => {
  return s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
};

export const isItToday = (state) => {
  const day = Number(p2e(new Date().toLocaleDateString("fa-IR", { day: "numeric" })));
  const weekDay = new Date().toLocaleDateString("fa-IR", { weekday: "long" });
  const indexOfWeekDay = state.daysOfWeekLong.findIndex((d) => weekDay === d);

  const startIndex = day - (indexOfWeekDay - (state.currentMonth.startIndex - 1));
  const weekStartIndex = startIndex;
  const weekEndIndex = startIndex + 7;

  const isSameMonthAndYear =
    state.selectedMonth === state.month && state.selectedYear === state.year;
  const isSelectedDayStyleEmpty = !state.selectedDayStyle;

  if (state.view === "horizontal-week") {
    return (
      state.weekEndIndex === weekEndIndex &&
      state.weekStartIndex === weekStartIndex &&
      isSameMonthAndYear &&
      isSelectedDayStyleEmpty
    );
  } else {
    return isSameMonthAndYear && isSelectedDayStyleEmpty;
  }
};

export const isTodayHoliday = (state, d) => {
  const day = Number(p2e(d));
  return (
    state.day === day && state.selectedYear === state.year && state.selectedMonth === state.month
  );
};
export const yearChangesInWeekChangeHandler = (state, action) => {
  if (
    (action === "next" &&
      state.weekEndIndex === state.currentMonth.days.length &&
      state.selectedMonth === 12) ||
    (action === "previous" && state.weekStartIndex === 0 && state.selectedMonth === 1)
  )
    return true;
  return false;
};
