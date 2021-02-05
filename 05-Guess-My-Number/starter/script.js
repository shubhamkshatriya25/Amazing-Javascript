'use strict';
// To use emoji: Window + .
const again = document.querySelector('.again');
const number = document.querySelector('.number');
const message = document.querySelector('.message');
const check = document.querySelector('.check');
const score = document.querySelector('.score');
const highscore = document.querySelector('.highscore');
const body = document.querySelector('body');

let realNumber = Math.trunc(Math.random() * 20) + 1;
let totalScore = 20;
let sessionHighScore = 0;

const lost = function () {
  body.style.backgroundColor = '#DC143C';
  message.textContent = `You have lost. The number is ${realNumber}.`;
  score.textContent = '0';
};

const wrongScore = function (msg) {
  totalScore--;
  message.textContent = msg;
  score.textContent = totalScore;
};

again.addEventListener('click', function () {
  number.textContent = '?';
  realNumber = Math.trunc(Math.random() * 20) + 1;
  body.style.backgroundColor = '#222';
  number.style.width = '15rem';
  check.disabled = false;
  totalScore = 20;
  check.style.cursor = 'pointer';
  score.textContent = '20';
  message.textContent = 'Start guessing...';
  document.querySelector('.guess').value = '';
});

check.addEventListener('click', function () {
  let guess = Number(document.querySelector('.guess').value);
  if (!guess) message.textContent = 'No Number Entered';
  else if (guess === realNumber) {
    body.style.backgroundColor = '#60b347';
    number.textContent = realNumber;
    number.style.width = '30rem';
    highscore.textContent = Math.max(totalScore, sessionHighScore);
    check.disabled = true;
    check.style.cursor = 'not-allowed';
    sessionHighScore = totalScore;
    message.textContent = 'Congratulations, you guessed it right!';
  } else if (guess > realNumber) {
    if (totalScore > 1) wrongScore('Too high!');
    else lost;
  } else if (guess < realNumber) {
    if (totalScore > 1) wrongScore('Too low!');
    else lost;
  }
});
