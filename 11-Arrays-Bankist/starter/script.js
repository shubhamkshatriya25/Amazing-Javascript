'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const updateUI = account => {
  displayMovements(account.movements);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
};
///// to display all transactions done by a user
const displayMovements = (movement, sort = false) => {
  containerMovements.innerHTML = '';

  const movs = sort ? movement.slice().sort((a, b) => a - b) : movement;

  movs.forEach((mov, i) => {
    let type = mov > 0 ? 'deposit' : 'withdrawal';
    let html = `<div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__date"></div>
  <div class="movements__value">${Math.abs(mov)} €</div>
</div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

///// to display current balance of the user
const calcDisplayBalance = account => {
  account.balance = account.movements.reduce((accum, mov) => {
    return accum + mov;
  }, 0);
  labelBalance.textContent = `${account.balance} €`;
};

///// to display summary of the user
const calcDisplaySummary = account => {
  let inn = account.movements
    .filter(mov => mov > 0)
    .reduce((accum, deposit) => accum + deposit, 0);

  let out = account.movements
    .filter(mov => mov < 0)
    .reduce((accum, deposit) => accum + deposit, 0);

  let interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((accum, int) => accum + int, 0);

  labelSumIn.textContent = `${inn} €`;
  labelSumOut.textContent = `${Math.abs(out)} €`;
  labelSumInterest.textContent = `${interest} €`;
};

///// to generate username for each user
const generateUsername = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(value => value[0])
      .join('');
  });
};
generateUsername(accounts);

// login
let currentUser;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentUser = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentUser && currentUser.pin === Number(inputLoginPin.value)) {
    inputLoginPin.blur();
    inputLoginPin.value = inputLoginUsername.value = '';
    labelWelcome.textContent = `Welcome back ${
      currentUser.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '100';
    updateUI(currentUser);
  }
});

// transfer money
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  let amount = Number(inputTransferAmount.value);
  let receiver = accounts.find(acc => acc.username === inputTransferTo.value);
  if (
    receiver &&
    receiver?.username !== currentUser.username &&
    amount > 0 &&
    currentUser.balance >= amount
  ) {
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
    receiver.movements.push(amount);
    currentUser.movements.push(-amount);
    updateUI(currentUser);
  }
});

//request loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentUser.movements.some(mov => mov >= amount * 0.1)) {
    inputLoanAmount.value = '';
    currentUser.movements.push(amount);
    updateUI(currentUser);
  }
});

// sort the movements
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentUser.movements, !sorted);
  sorted = !sorted;
});

//close account
btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentUser.username &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentUser.username
    );
    accounts.splice(index);
    inputCloseUsername.value;
    containerApp.style.opacity = '0';
    labelWelcome.textContent = 'Log in to get started';
  }
});
///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array 
(one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at
 least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, 
and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy 
("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/*
const data1 = [3, 5, 2, 12, 7];
const data2 = [4, 1, 15, 8, 3];

//1
const newData1 = data1.slice();
newData1.splice(0, 1);
newData1.splice(-2);
// console.log(newData1);

//2
const finalData = data1.concat(data2);
// console.log(finalData);

//3
finalData.forEach((dogAge, index) => {
  if (dogAge > 2)
    console.log(
      `Dog number ${index + 1} is an adult, and is ${dogAge} years old`
    );
  else console.log(`Dog number ${index + 1} is still a puppy 🐶`);
});
*/

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and 
calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. 
If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years
   old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate 
  averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
/*
const calcAverageHumanAge = arr => {
  const average = arr
    .map(age => {
      if (age <= 2) return age * 2;
      else return age * 4 + 16;
    })
    .filter(age => age > 18)
    .reduce((accum, age, i, arr) => accum + age / arr.length, 0);
  console.log(average);
};

calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

 */

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property.
Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight
   needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find 
Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little 
('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and 
Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside 
  the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). 
Basically, the current portion should be between 90% and 110% of the recommended portion.

*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);
//console.log(dogs);

const saragDog = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(saragDog);
console.log(
  `Sarah's dog is eating too ${
    saragDog.curFood > saragDog.recommendedFood ? 'much' : 'little'
  }`
);

const tooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(tooMuch);

const tooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(tooLittle);

console.log(`${tooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${tooLittle.join(' and ')}'s dogs eat too less!`);

console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

const checkEatingOkay = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;

console.log(dogs.some(checkEatingOkay));

console.log(dogs.filter(checkEatingOkay));

const sortedDog = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(sortedDog);
