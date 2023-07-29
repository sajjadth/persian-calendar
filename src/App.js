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
      year: null,
      month: null,
      day: null,
      selectedYear: null,
      selectedMonth: null,
      selectedDay: null,
      loading: true,
      currentYear: null,
      currentMonth: null,
      error: false,
      errorMessage: null,
      selectedDayStyle: null,
      eventsOfMonth: null,
      daysOfWeek: ["شنبه", "یک", "دو", "سه", "چهار", "پنج", "جمعه"],
      todayEvents: null,
    };
    this.getData = this.getData.bind(this);
    this.daysClickHandler = this.daysClickHandler.bind(this);
    this.getTodayEvents = this.getTodayEvents.bind(this);
    this.monthChangeHandler = this.monthChangeHandler.bind(this);
    this.retryHandler = this.retryHandler.bind(this);
    this.backToTodayHandler = this.backToTodayHandler.bind(this);
    this.isItToday = this.isItToday.bind(this);
    this.isTodayHoliday = this.isTodayHoliday.bind(this);
  }
  p2e(s) {
    return s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  }
  e2a(s) {
    return s.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
  }
  e2p(s) {
    return s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
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
      this.setState({ loading: true });
      this.setState({ error: false });
      this.setState({ errorMessage: null });
      setTimeout(() => {
        if (!this.state.error) {
          this.getTodayEvents(this.state.day);
          this.setState({ loading: false });
        }
      }, 1250);
    }, 750);
  }
  getTodayEvents(day) {
    let events = [];
    let eventsOfMonth = [];
    if (!this.state.currentMonth) {
      this.setState({ error: true });
      this.setState({
        errorMessage: "مشکل در برقراری ارتباط رخ داده لطفا دوباره امتحان کنید.",
      });
      this.setState({ loading: false });
    } else {
      this.state.currentMonth.events.forEach((event) => {
        if (Number(event.jDay) === day) {
          events.push(event);
        }
        if (event.isHoliday) {
          eventsOfMonth.push(Number(event.jDay));
        }
      });
      this.setState({ todayEvents: events, eventsOfMonth: eventsOfMonth, loading: false });
    }
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
      this.setState(
        {
          currentYear: data[this.state.selectedYear],
          currentMonth: data[this.state.selectedYear][this.state.selectedMonth - 1],
        },
        () => this.getTodayEvents()
      );
    } catch (err) {
      this.setState({
        error: true,
        errorMessage: "مشکل در برقراری ارتباط رخ داده لطفا دوباره امتحان کنید.",
        loading: false,
      });
    }
  }
  daysClickHandler(e) {
    let target = e.target;
    if (target.classList.contains("secandary-day") || target.classList.contains("jalali")) {
      target = e.target.parentNode;
    } else if (target.classList.contains("qamari") || target.classList.contains("miladi")) {
      target = e.target.parentNode.parentNode;
    }
    target = target.id;
    if (target !== "today-" + this.state.theme) {
      if (!this.state.selectedDayStyle)
        document.getElementById(target).classList.add("selected-" + this.state.theme);
      else {
        document
          .getElementById(this.state.selectedDayStyle)
          .classList.remove("selected-" + this.state.theme);
        document.getElementById(target).classList.add("selected-" + this.state.theme);
      }
      this.setState({ selectedDayStyle: target });
    } else {
      document
        .getElementById(this.state.selectedDayStyle)
        .classList.remove("selected-" + this.state.theme);
      this.setState({ selectedDayStyle: null });
    }
    this.getTodayEvents(
      Number(this.p2e(document.getElementById(target).childNodes[0].textContent))
    );
  }
  monthChangeHandler(e) {
    if (this.state.selectedDayStyle) {
      document
        .getElementById(this.state.selectedDayStyle)
        .classList.remove("selected-" + this.state.theme);
      this.setState({ selectedDayStyle: null });
    }
    setTimeout(() => {
      if (document.getElementById("today-" + this.state.theme)) {
        this.getTodayEvents(this.state.day);
      }
    });
    switch (e.target.id.split("-")[0]) {
      case "next":
        if (this.state.selectedMonth === 12) {
          this.setState({ loading: true });
          this.setState({ selectedYear: this.state.selectedYear + 1 });
          this.getData(this.state.selectedYear + 1);
          this.setState({ selectedMonth: 1 });
          setTimeout(() => {
            if (
              this.state.selectedMonth === this.state.month &&
              this.state.selectedYear === this.state.year
            ) {
              this.getTodayEvents(this.state.day);
            } else this.getTodayEvents(0);
            if (!this.state.error) {
              this.setState({ loading: false });
            }
          }, 2000);
        } else {
          this.setState({ selectedMonth: this.state.selectedMonth + 1 });
          this.setState({
            currentMonth: this.state.currentYear[this.state.selectedMonth],
          });
          setTimeout(() => {
            if (
              this.state.selectedMonth === this.state.month &&
              this.state.selectedYear === this.state.year
            ) {
              this.getTodayEvents(this.state.day);
            } else this.getTodayEvents(0);
          });
        }
        break;

      case "previous":
        if (this.state.selectedMonth === 1) {
          this.setState({ loading: true });
          this.setState({ selectedMonth: 12 });
          this.setState({ selectedYear: this.state.selectedYear - 1 });
          this.getData(this.state.selectedYear - 1);
          setTimeout(() => {
            if (
              this.state.selectedMonth === this.state.month &&
              this.state.selectedYear === this.state.year
            ) {
              this.getTodayEvents(this.state.day);
            } else this.getTodayEvents(0);
            if (!this.state.error) {
              this.setState({ loading: false });
            }
          }, 2000);
        } else {
          this.setState({ selectedMonth: this.state.selectedMonth - 1 });
          this.setState({
            currentMonth: this.state.currentYear[this.state.selectedMonth - 2],
          });
          setTimeout(() => {
            if (
              this.state.selectedMonth === this.state.month &&
              this.state.selectedYear === this.state.year
            ) {
              this.getTodayEvents(this.state.day);
            } else this.getTodayEvents(0);
          });
        }
        break;
      default:
        break;
    }
  }
  backToTodayHandler() {
    if (this.state.selectedDayStyle)
      document
        .getElementById(this.state.selectedDayStyle)
        .classList.remove("selected-" + this.state.theme);
    this.setState({ selectedDayStyle: null });
    if (this.state.selectedYear === this.state.year) {
      this.setState({ selectedMonth: this.state.month });
      setTimeout(() => {
        this.setState({
          currentMonth: this.state.currentYear[this.state.month - 1],
        });
        setTimeout(() => {
          this.getTodayEvents(this.state.day);
        }, 50);
      });
    } else {
      this.setState({ loading: true });
      this.setState({ selectedMonth: this.state.month });
      this.setState({ selectedYear: this.state.year });
      setTimeout(() => {
        this.getData(this.state.year);
        setTimeout(() => {
          if (!this.state.error) {
            this.getTodayEvents(this.state.day);
            this.setState({ loading: false });
          }
        }, 2000);
      });
    }
  }
  render() {
    return (
      <div id={"main-" + this.state.theme}>
        <div id={"calendar-" + this.state.theme}>
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
              daysOfWeek={this.state.daysOfWeek}
              eventsOfMonth={this.state.eventsOfMonth}
              todayEvents={this.state.todayEvents}
              monthChangeHandler={this.monthChangeHandler}
              backToTodayHandler={this.backToTodayHandler}
              daysClickHandler={this.daysClickHandler}
              isItToday={this.isItToday}
              isTodayHoliday={this.isTodayHoliday}
              fixEventText={this.fixEventText}
              e2p={this.e2p}
              e2a={this.e2a}
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
    this.setState({ year: Number(this.p2e(date[0])) });
    this.setState({ selectedYear: Number(this.p2e(date[0])) });
    this.setState({ month: Number(this.p2e(date[1])) });
    this.setState({ selectedMonth: Number(this.p2e(date[1])) });
    this.setState({ day: Number(this.p2e(date[2])) });
    this.setState({ selectedDay: Number(this.p2e(date[2])) });
  }
  componentDidMount() {
    this.getData(this.state.year);
  }
}

export default App;
