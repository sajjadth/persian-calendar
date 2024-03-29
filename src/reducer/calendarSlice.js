import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isItToday, p2e, yearChangesInWeekChangeHandler } from "../selectors";
const initState = {
  theme: "dark",
  view: null,
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
  errorType: null,
  selectedDayStyle: null,
  todayEvents: null,
  weekStartIndex: null,
  weekEndIndex: null,
  action: null,
  getDataStatus: "idle",
  daysOfWeek: ["شنبه", "یک", "دو", "سه", "چهار", "پنج", "جمعه"],
  daysOfWeekLong: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"],
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
      const viewChange = action.payload.viewChange;
      if (params.length !== 0 && !viewChange) {
        params.forEach((p) => {
          const [key, value] = p.split("=");
          if (key === "theme" && value === "light") state.theme = value;
          if (
            key === "view" &&
            (value === "horizontal-week" || value === "day" || value === "vertical-week")
          )
            state.view = value;
          if (!state.view) state.view = "month";
        });
      }
      state.year = Number(p2e(date[0]));
      state.selectedDay = Number(p2e(date[2]));
      state.selectedYear = Number(p2e(date[0]));
      state.month = Number(p2e(date[1]));
      state.selectedMonth = Number(p2e(date[1]));
      state.day = Number(p2e(date[2]));
      if (viewChange) {
        calendarSlice.caseReducers.actionsAfterFulfulledGetDate(state);
        state.loading = false;
      }
    },
    actionsAfterFulfulledGetDate: (state, action) => {
      switch (state.view) {
        case "horizontal-week":
          calendarSlice.caseReducers.actionsBeforeMountingHorizontalWeekView(state);
          break;
        case "vertical-week":
          calendarSlice.caseReducers.actionsBeforeMountingHorizontalWeekView(state);
          break;
        case "month":
          calendarSlice.caseReducers.onChangeMonthCheckForEvents(state);
          break;
        case "day":
          calendarSlice.caseReducers.onChangeMonthCheckForEvents(state);
          break;
        default:
          //should get the width and height of window and select best view
          break;
      }
    },
    actionsBeforeMountingHorizontalWeekView: (state, action) => {
      if (state.action) {
        state.weekStartIndex = state.action === "next" ? 0 : state.currentMonth.days.length - 7;
        state.weekEndIndex = state.action === "next" ? 7 : state.currentMonth.days.length;
      } else {
        const day = Number(p2e(new Date().toLocaleDateString("fa-IR", { day: "numeric" })));
        const weekDay = new Date().toLocaleDateString("fa-IR", { weekday: "long" });
        const indexOfWeekDay = state.daysOfWeekLong.findIndex((d) => weekDay === d);
        const startIndex = day - (indexOfWeekDay - (state.currentMonth.startIndex - 1));
        state.weekStartIndex = startIndex;
        state.weekEndIndex = startIndex + 7;
      }
      calendarSlice.caseReducers.onChangeMonthCheckForEvents(state);
    },
    getTodayEvents: (state, action) => {
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
      if (state.getDataStatus === "fulfilled") state.loading = false;
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
      const checkView = state.view.includes("-week");
      calendarSlice.caseReducers.getTodayEvents(state, {
        payload: checkView && !isItToday(state) ? 0 : checkMonthAndYear ? state.day : 0,
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
      const day = Number(p2e(new Date().toLocaleDateString("fa-IR", { day: "numeric" })));
      const weekDay = new Date().toLocaleDateString("fa-IR", { weekday: "long" });
      const indexOfWeekDay = state.daysOfWeekLong.findIndex((d) => weekDay === d);
      const startIndex = day - (indexOfWeekDay - (state.currentMonth.startIndex - 1));
      let weekStartIndex = startIndex;
      let weekEndIndex = startIndex + 7;

      if (state.action) state.action = null;
      if (state.view.includes("-week")) {
        if (
          (state.weekStartIndex !== weekStartIndex && state.weekEndIndex !== weekEndIndex) ||
          state.selectedYear !== state.year ||
          state.selectedMonth !== state.month
        ) {
          state.weekStartIndex = weekStartIndex;
          state.weekEndIndex = weekEndIndex;
          calendarSlice.caseReducers.getTodayEvents(state, { payload: state.day });
        }
        if (
          state.selectedDayStyle ||
          state.selectedYear !== state.year ||
          state.selectedMonth !== state.month
        ) {
          state.selectedDayStyle = null;
          state.selectedMonth = state.month;
          state.currentMonth = state.currentYear[state.month - 1];
          state.selectedYear = state.year;
          calendarSlice.caseReducers.actionsAfterFulfulledGetDate(state);
        }
      } else {
        if (
          state.selectedDayStyle ||
          state.selectedYear !== state.year ||
          state.selectedMonth !== state.month
        ) {
          state.selectedDayStyle = null;
          state.selectedMonth = state.month;
          state.currentMonth = state.currentYear[state.month - 1];
          state.selectedYear = state.year;
          calendarSlice.caseReducers.actionsAfterFulfulledGetDate(state);
        }
      }
    },
    weekChangeHandler: (state, action) => {
      const e = action.payload;
      state.selectedDayStyle = null;
      if (yearChangesInWeekChangeHandler(state, e)) {
        state.selectedMonth = e === "next" ? 1 : 12;
        state.selectedYear = e === "next" ? state.selectedYear + 1 : state.selectedYear - 1;
        state.action = e;
      } else {
        state.action = null;
        if (e === "next") {
          if (state.weekEndIndex === state.currentMonth.days.length) {
            calendarSlice.caseReducers.monthChangeHandler(state, { payload: e });
            state.weekStartIndex = 0;
            state.weekEndIndex = 7;
          } else {
            state.weekStartIndex = state.weekEndIndex;
            state.weekEndIndex += 7;
          }
        } else {
          if (state.weekStartIndex === 0) {
            calendarSlice.caseReducers.monthChangeHandler(state, { payload: e });
            state.weekEndIndex = state.currentMonth.days.length;
            state.weekStartIndex = state.weekEndIndex - 7;
          } else {
            state.weekEndIndex = state.weekStartIndex;
            state.weekStartIndex -= 7;
          }
        }
      }
      if (isItToday(state))
        calendarSlice.caseReducers.getTodayEvents(state, { payload: state.day });
      else calendarSlice.caseReducers.getTodayEvents(state, { payload: 0 });
    },
    changeView: (state, action) => {
      state.loading = true;
      const params = window.location.search.slice(1, window.location.search.length).split("&");
      const date = new Date().toLocaleDateString("fa-IR").split("/");
      state.view = action.payload;
      calendarSlice.caseReducers.actionsBeforeMounting(state, {
        payload: { params: params, date: date, viewChange: true },
      });
    },
    newError: (state, action) => {
      if (!action.payload || (!action.payload.message && !action.payload.type)) {
        state.error = false;
        state.errorType = null;
        state.errorMessage = null;
      } else if (action.payload.message && action.payload.type) {
        state.error = true;
        state.errorType = action.payload.type;
        state.errorMessage = action.payload.message;
      }
    },
    handleResize: (state, action) => {
      let view = "month";
      const params = window.location.search.slice(1, window.location.search.length).split("&");
      if (params.length > 0) {
        params.forEach((p) => {
          const key = p.split("=")[0];
          const value = p.split("=")[1];
          if (key === "view") view = value;
        });
      }
      const w = window.innerWidth;
      const h = window.innerHeight;
      const reducer = calendarSlice.caseReducers;
      switch (view) {
        case "month":
          reducer.handleMonthView(state, { payload: { w: w, h: h, view: view } });
          break;
        case "vertical-week":
          reducer.handleVerticalWeekView(state, { payload: { w: w, h: h, view: view } });
          break;
        case "horizontal-week":
          reducer.handleHorizontalWeekView(state, { payload: { w: w, h: h, view: view } });
          break;
        case "day":
          reducer.handleDayView(state, { payload: { w: w, h: h } });
          break;
        default:
          break;
      }
    },
    handleMonthView: (state, action) => {
      const { w, h, view } = action.payload;
      const reducer = calendarSlice.caseReducers;
      if (state.error && h >= 200 && w >= 200) reducer.newError(state, { payload: {} });
      else if (w >= 350 && h >= 520 && state.view !== view)
        reducer.changeView(state, { payload: view });
      else if ((w < 350 || h < 520) && w >= 150 && h >= 405)
        reducer.changeView(state, { payload: "vertical-week" });
      else if ((w < 350 || h < 520) && w >= 475 && h >= 150)
        reducer.changeView(state, { payload: "horizontal-week" });
      else if ((w < 350 || h < 520) && h >= 200 && w >= 200)
        reducer.changeView(state, { payload: "day" });
      else if (h < 200 || w < 200)
        reducer.newError(state, {
          payload: {
            type: "display",
            message: "به نظر می‌رسد صفحه‌نمایش کوچک باشد. لطفاً ابعاد آن را بیشتر کنید.",
          },
        });
    },
    handleVerticalWeekView: (state, action) => {
      const { w, h, view } = action.payload;
      const reducer = calendarSlice.caseReducers;
      if (state.error && !(h < 200 || (h >= 405 && w < 150) || (h < 405 && w < 200)))
        reducer.newError(state, { payload: {} });
      else if (w >= 150 && h >= 405 && state.view !== view)
        reducer.changeView(state, { payload: view });
      else if (h < 405 && w >= 475 && h >= 150)
        reducer.changeView(state, { payload: "horizontal-week" });
      else if (h < 405 && h >= 200 && w >= 200) reducer.changeView(state, { payload: "day" });
      else if (h < 200 || (h >= 405 && w < 150) || (h < 405 && w < 200))
        reducer.newError(state, {
          payload: {
            type: "display",
            message: "به نظر می‌رسد صفحه‌نمایش کوچک باشد. لطفاً ابعاد آن را بیشتر کنید.",
          },
        });
    },
    handleHorizontalWeekView: (state, action) => {
      const { w, h, view } = action.payload;
      const reducer = calendarSlice.caseReducers;
      if (state.error && !(w < 200 || (w >= 475 && h < 150) || (w < 475 && h < 200)))
        reducer.newError(state, { payload: {} });
      else if (h >= 150 && w >= 475 && state.view !== view)
        reducer.changeView(state, { payload: view });
      else if (w < 475 && h >= 405 && w >= 150)
        reducer.changeView(state, { payload: "vertical-week" });
      else if (w < 475 && h >= 200 && w >= 200) reducer.changeView(state, { payload: "day" });
      else if (w < 200 || (w >= 475 && h < 150) || (w < 475 && h < 200))
        reducer.newError(state, {
          payload: {
            type: "display",
            message: "به نظر می‌رسد صفحه‌نمایش کوچک باشد. لطفاً ابعاد آن را بیشتر کنید.",
          },
        });
    },

    handleDayView: (state, action) => {
      const { w, h } = action.payload;
      const reducer = calendarSlice.caseReducers;
      if (h < 200 || w < 200) {
        reducer.newError(state, {
          payload: {
            type: "display",
            message: "به نظر می‌رسد صفحه‌نمایش کوچک باشد. لطفاً ابعاد آن را بیشتر کنید.",
          },
        });
      } else {
        reducer.newError(state, { payload: {} });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getData.pending, (state) => {
      state.loading = true;
      state.error = false;
      state.errorMessage = null;
      state.getDataStatus = "pending";
    });
    builder.addCase(getData.fulfilled, (state, action) => {
      state.currentYear = action.payload;
      state.currentMonth = action.payload[state.selectedMonth - 1];
      state.getDataStatus = "fulfilled";

      calendarSlice.caseReducers.actionsAfterFulfulledGetDate(state);

      let e = state.currentMonth.days[state.currentMonth.startIndex - 1 + state.day].events.list;
      const checkMonthAndYear =
        state.selectedMonth === state.month && state.selectedYear === state.year;
      state.todayEvents = checkMonthAndYear ? e : [];
    });
    builder.addCase(getData.rejected, (state, err) => {
      console.log(err);
      state.error = true;
      state.loading = false;
      state.errorMessage = "مشکل در برقراری ارتباط رخ داده لطفا دوباره امتحان کنید.";
      state.getDataStatus = "rejected";
    });
  },
});

export const {
  backToTodayHandler,
  monthChangeHandler,
  daysClickHandler,
  getTodayEvents,
  actionsBeforeMounting,
  weekChangeHandler,
  actionsBeforeMountingHorizontalWeekView,
  handleResize,
} = calendarSlice.actions;
export default calendarSlice.reducer;
