'use strict';
const Player0 = document.querySelector('.player--0');
const Player1 = document.querySelector('.player--1');
const Score0 = document.querySelector('#score--0');
const Score1 = document.querySelector('#score--1');
const Current0 = document.querySelector('#current--1');
const Current1 = document.querySelector('#current--1');
const dice = document.querySelector('.dice');
const newBtn = document.querySelector('.btn--new');
const rollBtn = document.querySelector('.btn--roll');
const holdBtn = document.querySelector('.btn--hold');

let playing, currentScore, activePlayer, scores;
const init = function () {
  dice.classList.add('hidden');
  scores = [0, 0];
  activePlayer = 0;
  Score0.textContent = '0';
  Score1.textContent = '0';
  currentScore = 0;
  playing = true;
  Current0.textContent = 0;
  Current1.textContent = 0;
  Player0.classList.remove('player--winner');
  Player1.classList.remove('player--winner');
  Player0.classList.add('player--active');
  Player1.classList.remove('player--active');
};
init();
const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  Player0.classList.toggle('player--active');
  Player1.classList.toggle('player--active');
};

holdBtn.addEventListener('click', function () {
  if (playing) {
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    if (scores[activePlayer] >= 100) {
      playing = false;
      dice.classList.add('hidden');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
    } else {
      switchPlayer();
    }
  }
});

rollBtn.addEventListener('click', function () {
  if (playing) {
    let diceNum = Math.trunc(Math.random() * 6) + 1;
    dice.classList.remove('hidden');
    dice.src = `dice-${diceNum}.png`;
    if (diceNum !== 1) {
      currentScore += diceNum;
      document.getElementById(
        `current--${activePlayer}`
      ).textContent = currentScore;
    } else {
      switchPlayer();
    }
  }
});

newBtn.addEventListener('click', init);
