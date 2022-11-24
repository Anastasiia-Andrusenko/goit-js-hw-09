
const buttonStartRef = document.querySelector('[data-start]');
// console.log(buttonStartRef);

const buttonStopRef = document.querySelector('[data-stop]');
// console.log(buttonStopRef);

const body = document.querySelector('body');

// додам класс для кнопок щоб додати сss стилі 
buttonStartRef.classList.add('button');
buttonStopRef.classList.add('button');

// функція отримання рандомного кольора
function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

// функція при кліку на старт
const clickStart = () => {
  body.style.backgroundColor = getRandomHexColor();
  buttonStartRef.setAttribute('disabled', true);
  buttonStopRef.removeAttribute('disabled');
};


// додаємо слухача на кнопку старт й встановлюємо інтервал
let timerId = null;
buttonStartRef.addEventListener("click", () => {
  timerId = setInterval(() => clickStart(), 1000);
});

// додаємо слухача на кнопку стоп й прибираємо інтервал
buttonStopRef.addEventListener("click", () => {
  clearInterval(timerId);
  buttonStopRef.setAttribute('disabled', true);
  buttonStartRef.removeAttribute('disabled');
});