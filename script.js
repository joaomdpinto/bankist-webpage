'use strict';

//ELEMENTS
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const buttonScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const navBarElement = document.querySelector('.nav');
const navOptionsElement = document.querySelector('.nav__links');
const headerElement = document.querySelector('.header');
const heightNavBar = navBarElement.getBoundingClientRect().height;
const sectionsElements = document.querySelectorAll('.section');
const allImages = document.querySelectorAll('.lazy-img');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotCointainer = document.querySelector('.dots');

///////////////////////////////////////
// Modal window

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
//Events
const scrollToSection1 = function (event) {
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

navOptionsElement.addEventListener('click', function (e) {
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

//Menu fade animation
const handleFadeAnimationNav = function (event) {
  const element = event.target;

  if (element?.classList.contains('nav__link')) {
    const siblings = element.closest('nav').querySelectorAll('.nav__link');
    const logo = element.closest('nav').querySelector('#logo');

    siblings.forEach(option => {
      element !== option && (option.style.opacity = this.opacity);
    });

    logo.style.opacity = this.opacity;
  }
};

navBarElement.addEventListener(
  'mouseover',
  handleFadeAnimationNav.bind({ opacity: 0.5 })
);
navBarElement.addEventListener(
  'mouseout',
  handleFadeAnimationNav.bind({ opacity: 1 })
);

//sticky nav bar
const stickyNav = entries => {
  const [entry] = entries;

  !entry.isIntersecting
    ? navBarElement.classList.add('nav__sticky')
    : navBarElement.classList.remove('nav__sticky');
};
const options = {
  root: null, //viewport : dont't need to be declared
  treshold: 0, //When element disapear of the screen
  rootMargin: `${-heightNavBar}px`, //special effect: heigh of navbar. appear 90px before section 1 appear
};

const observer = new IntersectionObserver(stickyNav, options);
observer.observe(headerElement);

//Sections Animation
const revealSection = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  sectionObserver.unobserve(entry.target);
};

const optionsSections = {
  root: null,
  threshold: 0.15,
};

const sectionObserver = new IntersectionObserver(
  revealSection,
  optionsSections
);

sectionsElements.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//Lazy Loading Images
const revealImage = entries => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  //slow connection: when HD image finish load, remove blur
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  imagesObserver.unobserve(entry.target);
};

const optionsImages = {
  root: null,
  threshold: 0.5,
  rootMargin: '200px', //load 200px before we reach them
};

const imagesObserver = new IntersectionObserver(revealImage, optionsImages);

allImages.forEach(img => {
  imagesObserver.observe(img);
});

//SLIDER
let currentSlide = 0;

//sliderdots
const createDots = function () {
  slides.forEach((_, i) => {
    const html = `<button class="dots__dot" data-slide="${i}"></button>`;
    dotCointainer.insertAdjacentHTML('beforeend', html);
  });
};

const activeDot = function (number) {
  [...dotCointainer.children].forEach(dot => {
    if (dot.dataset.slide === number.toString()) {
      dot.classList.add('dots__dot--active');
    } else {
      dot.classList.remove('dots__dot--active');
    }
  });
};

const moveSlide = function () {
  if (this?.direction === 'right')
    currentSlide < slides.length - 1 ? currentSlide++ : (currentSlide = 0);
  else if (this?.direction === 'left')
    currentSlide > 0 ? currentSlide-- : (currentSlide = slides.length - 1);

  slides.forEach((slide, i) => {
    slide.style.transform = `translate(${(i - currentSlide) * 100}%)`;
  });
  activeDot(currentSlide);
};

//mouse
btnRight.addEventListener('click', moveSlide.bind({ direction: 'right' }));
btnLeft.addEventListener('click', moveSlide.bind({ direction: 'left' }));

//keyboard
document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowRight') moveSlide.bind({ direction: 'right' })();
  else if (event.key === 'ArrowLeft') moveSlide.bind({ direction: 'left' })();
});

dotCointainer.addEventListener('click', function (event) {
  const dotNumber = event.target.dataset.slide;
  if (dotNumber) {
    currentSlide = dotNumber;
    moveSlide();
  }
});

createDots(); //criar pontos no slider
moveSlide(); //aplicação inicia com o slide 0
