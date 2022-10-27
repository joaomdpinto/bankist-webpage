'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btnOpenModal =>
  btnOpenModal.addEventListener('click', openModal)
);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Button Scrolling
const buttonScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

//Events
const scrollToSection1 = function (event) {
  console.log(event);
  section1.scrollIntoView({ behavior: 'smooth' });
};

buttonScrollTo.addEventListener('click', scrollToSection1);

//Page Navigation

//BAD SOLUTION
// document.querySelectorAll('.nav__link').forEach(el =>
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//     document
//       .querySelector(this.getAttribute('href'))
//       .scrollIntoView({ behavior: 'smooth' });
//   })
// );

//MORE EFFICIENT
//1. Add event listener to common parent element
//2. Determine what element originated the event (event.target);

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  const element = e.target;

  //Matching strategy
  if (element.classList.contains('nav__link')) {
    document
      .querySelector(element.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabs
const tabs = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabs.addEventListener('click', function (e) {
  //⚠️ use closest because inside the button have a span element
  const selectedTab = e.target.closest('.operations__tab');

  //Matching strategy
  if (selectedTab?.classList.contains('operations__tab')) {
    //TAB
    [...selectedTab.parentNode.children].forEach(node => {
      node.getAttribute('data-tab') === selectedTab.getAttribute('data-tab')
        ? selectedTab.classList.add('operations__tab--active')
        : node.classList.remove('operations__tab--active');
    });

    //CONTENT
    tabsContent.forEach(node => {
      node.classList.contains(
        `operations__content--${selectedTab.getAttribute('data-tab')}`
      )
        ? node.classList.add('operations__content--active')
        : node.classList.remove('operations__content--active');
    });
  }
});
