import Notiflix from 'notiflix';

const formRef = document.querySelector('.form');

formRef.addEventListener('submit', onClickCreatePromises);

function onClickCreatePromises(evt) {
  evt.preventDefault();
  let delay = Number(formRef.elements.delay.value);
  const step = Number(formRef.elements.step.value);
  const amount = Number(formRef.elements.amount.value);
  // console.log(delay);
  // console.log(step);
  // console.log(amount);
  for (let position = 1; position <= amount; position += 1) {
    // const element = array[position];
    createPromise(position, delay)
    .then(({ position, delay }) => {
      Notiflix.Notify.success(`Fulfilled promise ${position} in ${delay}ms`);
    })
    .catch(({ position, delay }) => {
      Notiflix.Notify.failure(`Rejected promise ${position} in ${delay}ms`);
    });
    delay += step;
  }
}

function createPromise(position, delay) {
  const promise = new Promise((resolve, reject) => 
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
      // Fulfill
        resolve({ position, delay });
      } else {
      // Reject
        reject({ position, delay });
    }
    }, delay)
  );
  return promise;
}
