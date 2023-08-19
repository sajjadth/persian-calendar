export const getClassName = (t, name) => {
  const theme = t.slice(0, 1).toUpperCase() + t.slice(1, t.length).toLowerCase();
  return `${name}${theme}`;
};
export const p2e = (s) => {
  return s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
};

export const isItToday = (state) => {
  return (
    state.selectedMonth === state.month &&
    state.selectedYear === state.year &&
    !state.selectedDayStyle
  );
};
export const isTodayHoliday = (state, d) => {
  const day = Number(p2e(d));
  return (
    state.day === day && state.selectedYear === state.year && state.selectedMonth === state.month
  );
};
