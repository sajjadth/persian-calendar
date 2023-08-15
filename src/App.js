import "./App.sass";
import React from "react";
import Loading from "./components/loading";
import Error from "./components/error";
import Calendar from "./components/calendar/calnedar";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
    this.getData = this.getData.bind(this);
    this.isItToday = this.isItToday.bind(this);
    this.getClassName = this.getClassName.bind(this);
    this.retryHandler = this.retryHandler.bind(this);
    this.isTodayHoliday = this.isTodayHoliday.bind(this);
    this.daysClickHandler = this.daysClickHandler.bind(this);
    this.backToTodayHandler = this.backToTodayHandler.bind(this);
    this.monthChangeHandler = this.monthChangeHandler.bind(this);
  }
  p2e(s) {
    return s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  }
  isItToday() {
    return (
      this.state.selectedMonth === this.state.month &&
      this.state.selectedYear === this.state.year &&
      this.state.selectedDay === this.state.day &&
      !this.state.selectedDayStyle
    );
  }
  isTodayHoliday(d) {
    return (
      this.state.day === Number(this.p2e(d)) &&
      this.state.selectedYear === this.state.year &&
      this.state.selectedMonth === this.state.month
    );
  }
  retryHandler() {
    setTimeout(() => {
      this.setState({ loading: true, errorMessage: null, error: false }, () =>
        this.getData(this.state.year)
      );
    });
  }
  getTodayEvents(day) {
    if (!this.state.currentMonth) {
      this.setState(
        { error: true, errorMessage: "مشکل در برقراری ارتباط رخ داده لطفا دوباره امتحان کنید." },
        () => this.setState({ loading: false })
      );
    } else {
      if (day === 0) this.setState({ todayEvents: [] }, () => this.setState({ loading: false }));
      else {
        let e =
          this.state.currentMonth.days[this.state.currentMonth.startIndex - 1 + day].events.list;
        this.setState({ todayEvents: e }, () => this.setState({ loading: false }));
      }
    }
  }
  async getData(year) {
    try {
      const res = await fetch(`https://persian-calendar-api.sajjadth.workers.dev?year=${year}`);
      if (!res.ok) {
        this.setState({
          error: true,
          errorMessage: "مشکل در برقراری ارتباط رخ داده لطفا دوباره امتحان کنید.",
          loading: false,
        });
      }
      const data = await res.json();

      this.setState(
        {
          currentYear: data,
          currentMonth: data[this.state.selectedMonth - 1],
        },
        () => {
          this.getTodayEvents(this.state.year === this.state.selectedYear ? this.state.day : 0);
        }
      );
    } catch (err) {
      this.setState({
        error: true,
        errorMessage: "مشکل در برقراری ارتباط رخ داده لطفا دوباره امتحان کنید.",
        loading: false,
      });
    }
  }
  getClassName(name) {
    const t = this.state.theme;
    const theme = t.slice(0, 1).toUpperCase() + t.slice(1, t.length).toLowerCase();
    return `${name}${theme}`;
  }
  daysClickHandler(e) {
    this.setState({ selectedDayStyle: e ? Number(e) : null });
    this.getTodayEvents(Number(e));
  }
  onChangeMonthCheckForEvents(year) {
    if (year) this.getData(year);
    if (
      this.state.selectedMonth === this.state.month &&
      this.state.selectedYear === this.state.year
    )
      this.getTodayEvents(this.state.day);
    else this.getTodayEvents(0);
  }
  monthChangeHandler(e) {
    this.setState({ selectedDayStyle: null });
    switch (e) {
      case "next":
        const nextMonth = this.state.selectedMonth === 12 ? 1 : this.state.selectedMonth + 1;
        const nextYear = this.state.selectedMonth === 12 ? this.state.selectedYear + 1 : null;
        this.setState({ loading: true }, () => {
          this.setState(
            {
              selectedMonth: nextMonth,
              selectedYear: !nextYear ? this.state.selectedYear : nextYear,
              currentMonth:
                this.state.currentYear[
                  this.state.selectedMonth === 12 ? 0 : this.state.selectedMonth
                ],
            },
            () => this.onChangeMonthCheckForEvents(nextYear)
          );
        });
        break;

      case "previous":
        const prevMonth = this.state.selectedMonth === 1 ? 12 : this.state.selectedMonth - 1;
        const prevYear = this.state.selectedMonth === 1 ? this.state.selectedYear - 1 : null;
        this.setState({ loading: true }, () => {
          this.setState(
            {
              selectedMonth: prevMonth,
              selectedYear: !prevYear ? this.state.selectedYear : prevYear,
              currentMonth:
                this.state.currentYear[this.state.selectedMonth === 1 ? 11 : prevMonth - 1],
            },
            () => this.onChangeMonthCheckForEvents(prevYear)
          );
        });
        break;
      default:
        break;
    }
  }
  backToTodayHandler() {
    if (
      this.state.selectedDayStyle ||
      this.state.selectedYear !== this.state.year ||
      this.state.selectedMonth !== this.state.month
    ) {
      this.setState(
        (prevState) => ({
          selectedDayStyle: null,
          selectedMonth: prevState.month,
          currentMonth: prevState.currentYear[prevState.month - 1],
          loading: prevState.selectedYear !== prevState.year,
          selectedYear: prevState.year,
        }),
        () => {
          if (this.state.loading) this.getData(this.state.year);
          else this.getTodayEvents(this.state.day);
        }
      );
    }
  }
  render() {
    return (
      <div id={this.getClassName("main")}>
        {this.state.loading ? (
          <Loading />
        ) : this.state.error ? (
          <Error
            theme={this.state.theme}
            errorMessage={this.state.errorMessage}
            retryHandler={this.retryHandler}
          />
        ) : (
          <Calendar
            theme={this.state.theme}
            selectedDay={this.state.selectedDay}
            todayEvents={this.state.todayEvents}
            currentMonth={this.state.currentMonth}
            selectedDayStyle={this.state.selectedDayStyle}
            isItToday={this.isItToday}
            fixEventText={this.fixEventText}
            getClassName={this.getClassName}
            isTodayHoliday={this.isTodayHoliday}
            monthChangeHandler={this.monthChangeHandler}
            backToTodayHandler={this.backToTodayHandler}
            daysClickHandler={this.daysClickHandler}
            getTodayEvents={this.getTodayEvents}
            day={this.state.day}
          />
        )}
      </div>
    );
  }
  componentWillMount() {
    const params = window.location.search.slice(1, window.location.search.length).split("&");
    if (params.length !== 0) {
      params.forEach((p) => {
        const [key, value] = p.split("=");
        if (key === "theme" && value === "light") this.setState({ theme: value });
      });
    }
    let date = new Date().toLocaleDateString("fa-IR").split("/");
    this.setState({
      year: Number(this.p2e(date[0])),
      selectedDay: Number(this.p2e(date[2])),
      selectedYear: Number(this.p2e(date[0])),
      month: Number(this.p2e(date[1])),
      selectedMonth: Number(this.p2e(date[1])),
      day: Number(this.p2e(date[2])),
    });
  }
  componentDidMount() {
    this.getData(this.state.year);
  }
}

export default App;
