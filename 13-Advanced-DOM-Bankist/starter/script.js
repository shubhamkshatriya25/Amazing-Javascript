'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const sec1 = document.getElementById('section--1');
const navLinks = document.querySelector('.nav__links');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const lazyImages = document.querySelectorAll('img[data-src]');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(element => {
  element.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//smooth scroll
btnScrollTo.addEventListener('click', () => {
  sec1.scrollIntoView({ behavior: 'smooth' });
});

//navigation and event delegation
navLinks.addEventListener('click', e => {
  e.preventDefault();
  console.log(e.target);
  if (e.target.classList.contains('nav__link')) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

//tab panels
tabsContainer.addEventListener('click', e => {
  const tabClicked = e.target.closest('.operations__tab');
  if (!tabClicked) return;

  tabs.forEach(el => el.classList.remove('operations__tab--active'));
  tabsContent.forEach(el => el.classList.remove('operations__content--active'));

  tabClicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${tabClicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//fading nav on hover and passing arguements to event-listeners
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// sticky navbar
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`,
});
headerObserver.observe(header);

// reveal on scroll
const revealSection = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// image lazy loading
const loadImg = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};
const imgLoader = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '100px',
});
lazyImages.forEach(img => {
  imgLoader.observe(img);
});

//Sliders
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length - 1;

function goToSlide(slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
}

const nextSlide = function () {
  curSlide === maxSlide ? (curSlide = 0) : curSlide++;
  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  curSlide === 0 ? (curSlide = maxSlide) : curSlide--;
  goToSlide(curSlide);
  activateDot(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', e => {
  e.key === 'ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide = "${slide}"]`)
    .classList.add('dots__dot--active');
};
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});
goToSlide(0);
createDots();
activateDot(0);
// const message = document.createElement('div');
// const header = document.querySelector('.header');
// message.classList.add('cookie-message');
// message.innerHTML =
//   'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// header.append(message);

// document.querySelector('.btn--close-cookie').addEventListener('click', () => {
//   message.remove();
// });
