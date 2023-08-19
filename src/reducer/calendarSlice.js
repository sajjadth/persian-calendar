import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { p2e } from "../selectors";
const initState = {
  theme: "dark",
  day: null,
  year: null,
  month: null,
  selectedYear: null,
  loading: true,
  selectedMonth: null,
  selectedDay: null,
  currentYear: null,
  currentMonth: null,
  error: false,
  errorMessage: null,
  selectedDayStyle: null,
  todayEvents: null,
  daysOfWeek: ["شنبه", "یک", "دو", "سه", "چهار", "پنج", "جمعه"],
};

export const getData = createAsyncThunk("calendar/getData", async (year) => {
  const response = await fetch(`https://persian-calendar-api.sajjadth.workers.dev?year=${year}`);
  const data = await response.json();
  return data;
});

export const calendarSlice = createSlice({
  initialState: initState,
  name: "calendar",
  reducers: {
    actionsBeforeMounting: (state, action) => {
      const params = action.payload.params;
      const date = action.payload.date;
      if (params.length !== 0) {
        params.forEach((p) => {
          const [key, value] = p.split("=");
          if (key === "theme" && value === "light") state.theme = value;
        });
      }
      state.year = Number(p2e(date[0]));
      state.selectedDay = Number(p2e(date[2]));
      state.selectedYear = Number(p2e(date[0]));
      state.month = Number(p2e(date[1]));
      state.selectedMonth = Number(p2e(date[1]));
      state.day = Number(p2e(date[2]));
    },
    getTodayEvents: (state, action) => {
      console.log("fajlsdfa;lskdgjsljkgnsdkjvn");
      const day = action.payload;
      if (day === 0) {
        state.todayEvents = [];
      } else if (!state.currentMonth) {
        state.error = true;
        state.errorMessage = "مشکل در برقراری ارتباط رخ داده لطفا دوباره امتحان کنید.";
      } else {
        let e = state.currentMonth.days[state.currentMonth.startIndex - 1 + day].events.list;
        state.todayEvents = e;
      }
    },
    daysClickHandler: (state, action) => {
      const e = action.payload;
      const todayCheck =
        state.year === state.selectedYear &&
        state.month === state.selectedMonth &&
        state.day === Number(e);
      state.selectedDayStyle = todayCheck ? null : e ? Number(e) : null;
      calendarSlice.caseReducers.getTodayEvents(state, { payload: Number(e) });
    },
    onChangeMonthCheckForEvents: (state, action) => {
      const checkMonthAndYear =
        state.selectedMonth === state.month && state.selectedYear === state.year;
      calendarSlice.caseReducers.getTodayEvents(state, {
        payload: checkMonthAndYear ? state.day : 0,
      });
    },
    monthChangeHandler: (state, action) => {
      const e = action.payload;
      switch (e) {
        case "next":
          const nextMonth = state.selectedMonth === 12 ? 1 : state.selectedMonth + 1;
          const nextYear = state.selectedMonth === 12 ? state.selectedYear + 1 : null;
          state.loading = nextYear ? true : false;
          state.selectedMonth = nextMonth;
          state.selectedYear = !nextYear ? state.selectedYear : nextYear;
          state.currentMonth =
            state.currentYear[state.selectedMonth > 12 ? 0 : state.selectedMonth - 1];
          calendarSlice.caseReducers.onChangeMonthCheckForEvents(state, { payload: nextYear });
          break;

        case "previous":
          const prevMonth = state.selectedMonth === 1 ? 12 : state.selectedMonth - 1;
          const prevYear = state.selectedMonth === 1 ? state.selectedYear - 1 : null;
          state.loading = prevYear ? true : false;
          state.selectedMonth = prevMonth;
          state.selectedYear = !prevYear ? state.selectedYear : prevYear;
          state.currentMonth = state.currentYear[state.selectedMonth < 1 ? 11 : prevMonth - 1];
          calendarSlice.caseReducers.onChangeMonthCheckForEvents(state, { payload: prevYear });
          break;
        default:
          break;
      }
    },
    backToTodayHandler: (state, action) => {
      if (
        state.selectedDayStyle ||
        state.selectedYear !== state.year ||
        state.selectedMonth !== state.month
      ) {
        state.loading = state.selectedYear !== state.year;
        state.selectedDayStyle = null;
        state.selectedMonth = state.month;
        state.currentMonth = state.currentYear[state.month - 1];
        state.selectedYear = state.year;

        calendarSlice.caseReducers.getTodayEvents(state, { payload: state.day });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getData.pending, (state) => {
      state.loading = true;
      state.error = false;
      state.errorMessage = null;
    });
    builder.addCase(getData.fulfilled, (state, action) => {
      state.currentYear = action.payload;
      state.currentMonth = action.payload[state.selectedMonth - 1];
      let e = state.currentMonth.days[state.currentMonth.startIndex - 1 + state.day].events.list;
      const checkMonthAndYear =
        state.selectedMonth === state.month && state.selectedYear === state.year;
      state.todayEvents = checkMonthAndYear ? e : [];
      state.loading = false;
    });
    builder.addCase(getData.rejected, (state, err) => {
      console.log(err);
      state.error = true;
      state.errorMessage = "مشکل در برقراری ارتباط رخ داده لطفا دوباره امتحان کنید.";
    });
  },
});

export const {
  backToTodayHandler,
  monthChangeHandler,
  daysClickHandler,
  getTodayEvents,
  actionsBeforeMounting,
} = calendarSlice.actions;
export default calendarSlice.reducer;
