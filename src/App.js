import "./App.sass";
import React from "react";
import Loading from "./components/loading";
import Error from "./components/error";
import Calendar from "./components/calnedar";

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
      eventsOfMonth: null,
      todayEvents: null,
    };
    this.getData = this.getData.bind(this);
    this.isItToday = this.isItToday.bind(this);
    this.getClassName = this.getClassName.bind(this);
    this.retryHandler = this.retryHandler.bind(this);
    this.isTodayHoliday = this.isTodayHoliday.bind(this);
    this.getTodayEvents = this.getTodayEvents.bind(this);
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
      !this.state.selectedDayStyle
    );
  }
  isTodayHoliday(d) {
    return (
      this.state.day === d &&
      this.state.selectedYear === this.state.year &&
      this.state.selectedMonth === this.state.month
    );
  }
  fixEventText(event) {
    return event.text.split(" ").slice(2, event.text.split(" ").length).join(" ").indexOf("[") !==
      -1
      ? event.text
          .split(" ")
          .slice(2, event.text.split(" ").length)
          .join(" ")
          .slice(
            0,
            event.text.split(" ").slice(2, event.text.split(" ").length).join(" ").indexOf("[")
          )
      : event.text.split(" ").slice(2, event.text.split(" ").length).join(" ");
  }
  retryHandler() {
    setTimeout(() => {
      this.getData(this.state.year);
      this.setState({ loading: true, errorMessage: null, error: false });
      setTimeout(() => {
        if (!this.state.error) {
          this.getTodayEvents(this.state.day);
        }
      }, 1250);
    }, 750);
  }
  getTodayEvents(day) {
    if (!this.state.currentMonth) {
      this.setState({
        error: true,
        errorMessage: "مشکل در برقراری ارتباط رخ داده لطفا دوباره امتحان کنید.",
        loading: false,
      });
      return;
    }
    let events = [];
    let eventsOfMonth = [];
    this.state.currentMonth.events.forEach((event) => {
      if (Number(event.jDay) === day) {
        events.push(event);
      }
      if (event.isHoliday) {
        eventsOfMonth.push(Number(event.jDay));
      }
    });
    this.setState({ todayEvents: events, eventsOfMonth: eventsOfMonth }, () => {
      this.setState({ loading: false });
    });
  }
  async getData(year) {
    try {
      const res = await fetch(
        "https://hmarzban.github.io/pipe2time.ir/api/" + String(year) + "/index.json"
      );
      if (!res.ok) {
        this.setState({
          error: true,
          errorMessage: "مشکل در برقراری ارتباط رخ داده لطفا دوباره امتحان کنید.",
          loading: false,
        });
      }
      const data = await res.json();
      console.log(1080, this.state.selectedYear, this.state.selectedMonth);
      this.setState(
        {
          currentYear: data[this.state.selectedYear],
          currentMonth: data[this.state.selectedYear][this.state.selectedMonth - 1],
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
    return `${name}-${this.state.theme}`;
  }
  daysClickHandler(e) {
    let target =
      e.target.classList.contains("secandary-day") || e.target.classList.contains("jalali")
        ? e.target.parentNode
        : e.target.classList.contains("qamari") || e.target.classList.contains("miladi")
        ? e.target.parentNode.parentNode
        : e.target;
    target = target.id;
    if (target !== this.getClassName("today")) {
      if (!this.state.selectedDayStyle)
        document.getElementById(target).classList.add(this.getClassName("selected"));
      else {
        document
          .getElementById(this.state.selectedDayStyle)
          .classList.remove(this.getClassName("selected"));
        document.getElementById(target).classList.add(this.getClassName("selected"));
      }
      this.setState({ selectedDayStyle: target });
    } else {
      document
        .getElementById(this.state.selectedDayStyle)
        .classList.remove(this.getClassName("selected"));
      this.setState({ selectedDayStyle: null });
    }
    this.getTodayEvents(
      Number(this.p2e(document.getElementById(target).childNodes[0].textContent))
    );
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
    if (this.state.selectedDayStyle)
      document
        .getElementById(this.state.selectedDayStyle)
        .classList.remove(this.getClassName("selected"));
    this.setState({ selectedDayStyle: null }, () => {
      if (document.getElementById(this.getClassName("today"))) this.getTodayEvents(this.state.day);
    });
    switch (e.target.id.split("-")[0]) {
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
      if (this.state.selectedDayStyle)
        document
          .getElementById(this.state.selectedDayStyle)
          .classList.remove(this.getClassName("selected"));
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
        <div id={this.getClassName("calendar")}>
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
              currentMonth={this.state.currentMonth}
              eventsOfMonth={this.state.eventsOfMonth}
              todayEvents={this.state.todayEvents}
              getClassName={this.getClassName}
              monthChangeHandler={this.monthChangeHandler}
              backToTodayHandler={this.backToTodayHandler}
              daysClickHandler={this.daysClickHandler}
              isItToday={this.isItToday}
              isTodayHoliday={this.isTodayHoliday}
              fixEventText={this.fixEventText}
            />
          )}
        </div>
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
