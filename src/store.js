import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from "./reducer/calendarSlice";

export default configureStore({
  reducer: {
    // loading: loadingReducer,
    calendar: calendarReducer
    // error: errorReducer,
  },
});
