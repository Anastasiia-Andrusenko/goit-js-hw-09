// підключаємо бібліотеки
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from 'notiflix';
require("flatpickr/dist/themes/dark.css");


// обираємо елементи
const refs = {
  buttonStartRef: document.querySelector('[data-start]'),
  inputRef: document.querySelector('#datetime-picker'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
  value: document.querySelectorAll('.value'),
};

// додаємо класи для css та деволтний стан кнопки
refs.buttonStartRef.classList.add('btn');
refs.buttonStartRef.setAttribute('disabled', true);
refs.inputRef.classList.add('input');

// Обираємо дату
const options = {
  enableTime: true,
  time_24hr: true,
  dateFormat: "d.m.Y H:i",
  defaultDate: new Date(),
  minuteIncrement: 1,
  onOpen() {
    refs.buttonStartRef.setAttribute('disabled', true);
    refs.value.forEach(element => {
      element.classList.remove('time-finished');
    });
  },
  onClose(selectedDates) {
    // console.log(selectedDates[0]);
    if (selectedDates[0] < new Date()) {
      Notiflix.Notify.failure('Please choose a date in the future');
      return;
    }
    refs.buttonStartRef.removeAttribute('disabled');
    const selectedDate = selectedDates[0].getTime();
    // console.log(selectedDate);
    localStorage.setItem("selectedDate", JSON.stringify(selectedDate));
  },
};

flatpickr(refs.inputRef, options);


// оновлюємо інтерфейс
function updateClockFace({ days, hours, minutes, seconds }) {
  refs.days.textContent = days;
  refs.hours.textContent = hours;
  refs.minutes.textContent = minutes;
  refs.seconds.textContent = seconds;
}

class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.onTick = onTick;
  }

  start() {
    refs.buttonStartRef.setAttribute('disabled', true);
    
    const savedSelectedDate = localStorage.getItem("selectedDate");
    const parsedSelectedDate = Number(JSON.parse(savedSelectedDate));

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = parsedSelectedDate - currentTime;
      const timeLeft = this.convertMs(deltaTime);
      this.onTick(timeLeft);

      if (deltaTime < 1000) {
        clearInterval(this.intervalId);
        refs.value.forEach(element => {
          element.classList.add('time-finished');
        });
        return;
      }
    }, 1000);
  }

  // функція перевода часу з мс в години, дні і тд
  convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = this.addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = this.addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = this.addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
  }

  // функція форматування часу (додавання 0)
  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  };
}

const timer = new Timer({
  onTick: updateClockFace,
});


// Вішаємо слухача на кнопку
refs.buttonStartRef.addEventListener("click", timer.start.bind(timer));