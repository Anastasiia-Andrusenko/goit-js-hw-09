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
  onChange() {
    if (timer.intervalId !== null) {
      Notiflix.Notify.warning('Timer cannot be restarted. Wait for the end');
    }
  },
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      Notiflix.Notify.failure('Please choose a date in the future');
      return;
    }
    refs.buttonStartRef.removeAttribute('disabled');
    const selectedDate = selectedDates[0].getTime();
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

// описуэмо клас Таймер
class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.onTick = onTick;
    this.isActive = false;
  }

  start() {
    if (this.isActive) {
      refs.buttonStartRef.setAttribute('disabled', true);
      return;
    }
    refs.buttonStartRef.setAttribute('disabled', true);
    this.isActive = true;
    const savedSelectedDate = localStorage.getItem("selectedDate");
    const parsedSelectedDate = Number(JSON.parse(savedSelectedDate));

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = parsedSelectedDate - currentTime;
      const timeLeft = this.convertMs(deltaTime);
      this.onTick(timeLeft);

      if (deltaTime < 1000) {
        this.isActive = false;
        clearInterval(this.intervalId);
        this.intervalId = null;
        localStorage.removeItem('selectedDate');
        refs.value.forEach(element => {
          element.classList.add('time-finished');
        });
        return;
      }
    }, 1000);
  }

  // функція перевода часу з мс в години, дні і тд
  convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = this.addLeadingZero(Math.floor(ms / day));
  const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = this.addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = this.addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
  }

  // функція форматування часу (додавання 0)
  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  };
}

// створюэмо таймер
const timer = new Timer({
  onTick: updateClockFace,
});


// Вішаємо слухача на кнопку
refs.buttonStartRef.addEventListener("click", timer.start.bind(timer));


// Функція для продовженя відліку після перезагрузки сторінки
function updatePage() {
  const savedSelectedDate = localStorage.getItem("selectedDate");
  if (savedSelectedDate) {
    timer.start();
  };
};

updatePage();