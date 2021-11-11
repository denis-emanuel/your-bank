'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal'); // node list
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (button) {
  button.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////////
//SMOOTH SCROLLING
////////////////////////////////////////////
//button 'Learn more' has the class 'btn--scroll-to'
//and the section we want to go to has the id "section--1"

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect(); //relative to the visible part of the website
  // console.log(window.pageXOffset, window.pageYOffset); //current scrolling position
  // console.log(
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // ); //current viewport height and width without the scroll buttons

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // ); //s1coords.top is relative to the top of the page, so it doesn't work everywhere so it needs the offset that is the scroll position on Y

  // //old school style:
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' }); //this only works in modern browsers
});

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault(); //because we need to smooth scroll here, not instantly scroll down

//     const idHref = this.getAttribute('href'); //#section--i
//     // console.log(idHref);

//     document.querySelector(idHref).scrollIntoView({ behavior: 'smooth' });
//   });

//   //basically for these 3 navigation link a callback function will be created for each one of them, so it's better to use event delegation on a common parent of the elements.
//   //So, we will put our event handler in the nav__links element
// });

// 1. Add event listener to common parent element
// 2. In the e.l. determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log(e.target); //where the event originated, in which of the three child elements of nav__links
  // But, there are 4 places where the event can happen, besides the 3 child elements there is the parent element

  e.preventDefault(); //to prevent the navigation link from the HTML script in href='#  ' to scroll to the target, so we can implement the smooth version of scrolling

  // Matching strategy to select only the navigation link children
  if (e.target.classList.contains('nav__link')) {
    const idHref = e.target.getAttribute('href');
    console.log(idHref);
    document.querySelector(idHref).scrollIntoView({ behavior: 'smooth' });
  }

  //Event delegation is also important when working with elements that are not yet on the page on run-time, eg: buttons added dynamically
});

//Tabbed component.

//not desireable:
// tabs.forEach(t => t.addEventListener('click', () => console.log('TAB')));
//the common parent is the tabsContainer for all 3 tabs
tabsContainer.addEventListener('click', e => {
  //the button has a <span> attribute that is clickable and if you click it, it becomes the target element
  const clicked = e.target.closest('.operations__tab');

  //guard clause
  if (!clicked) return; //because if we are clicking in an area that has no element close that has the operations__tab class clicked will be equal to null

  //activate tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //remove active from all content areas
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  //activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//For the menu fade animation on hover we want to use as the parent element all the <nav> sections as it has to also include the logo.
//mouseenter does not bubble up, but the mouseover option does
const handleHover = function (e, opacity) {
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
nav.addEventListener('mouseover', handleHover.bind(0.5)); //we used the bind method to pass an argument into a handler function
nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky navigation - old style
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);
//   //we want to implement the sticky navigation as soon as we get to the first section

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, //interested in the entire viewport
  threshold: 0, //only when the header is completely out of view
  rootMargin: `-${navHeight}px`, //as if the header moved with 90px down, basically it is a visual margin
});
headerObserver.observe(header);

// Reveal sections on scroll
const allSection = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]'); //we only want to select images that have the data-src attribute because only those are lazy loading images
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //replace src with data-src. Replace the placeholder image with the one we actually want
  entry.target.src = entry.target.dataset.src;

  //load event triggers after the image has finished loading on the page, and only then we want to remove the blurry filter, so the user can not see the placeholder image
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', //make them load faster so the user won't notice
});
imgTargets.forEach(img => imgObserver.observe(img));

//////////////////////////////////////////////////////////////////
//SLIDER
//////////////////////////////////////////////////////////////////

const slider = function () {
  const slides = document.querySelectorAll('.slide'); //4 slides with images on top of each other
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const slider = document.querySelector('.slider');
  const dotContainer = document.querySelector('.dots');
  let currentSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button"`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Next slide
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`) //make them go one after the other
      //-100%, 0%, 100%, 200% currentSlide = 1
    );
  };

  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) currentSlide = 0;
    else currentSlide++;

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  const prevSlide = function () {
    if (currentSlide === 0) currentSlide = maxSlide - 1;
    else currentSlide--;
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();
  //Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//////// Selecting, creating and deleting elements /////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

// console.log(document.documentElement); //if we want to add some style to the entire document that's the element we need. It's the entire HTML doc

// const allSections = document.querySelectorAll('.section');
// console.log(allSections); //node list

// document.getElementById('#section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons); //if you delete/add an element this updates automatically. This does not happen with a node list

// console.log(document.getElementsByClassName('btn'));

// // Creating and inserting elements
// const message = document.createElement('div'); //an object that represents a DOM element of html type div
// console.log(message);
// message.classList.add('cookie-message');
// // message.textContent='We use cookies for improved functionality and analytics';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// const header = document.querySelector('.header');
// header.prepend(message);
// header.append(message); //it's not present in both places, only in this last one
// //prepend = first child
// //append = last child
// //That's because a DOM element is unique so it can only exist at one place at a time
// // In order to make it appear at the beginning and at the end at the same time we need to clone it
// // header.append(message.cloneNode(true)); //true=all the child elements will also be copied

// header.after(message);
// header.before(message);
// //it will be inserted as a sibling before or after the header

// //Delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// ////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////
// ////////////// Styles, attributes and classes //////////////
// ////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////

// //Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%'; //these are inline styles directly in the DOM attribute
// console.log(message.style.height); //we get nothing, it works only for inline styles that we set, like backgroundColor or width that we previously defined
// console.log(getComputedStyle(message).color); //we do it like this

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// //CSS custom properties/variables
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //Attributes HTML
// const logo = document.querySelector('.nav__logo');
// console.log(logo.src); //the relative URL
// console.log(logo.alt);
// console.log(logo.className);

// logo.alt = 'Beautiful minimalist logo';

// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist');

// console.log(logo.src);
// console.log(logo.getAttribute('src')); //same for href attribute

// //Data attributes
// console.log(logo.dataset.versionNumber); //we use them when we need to store data in the UI

// //Classes
// logo.classList.add('c', 'a');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c');
// logo.className = 'denis'; //don't use, it overrides all the existing classes and you can only set one class

// const h1 = document.querySelector('h1');
// const alertH1 = function (e) {
//   alert('Iabadabadu');
//   h1.removeEventListener('mouseenter', alertH1);
// };
// h1.addEventListener('mouseenter', alertH1);

// ////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////
// //////////////////// EVENT PROPAGATIONS ////////////////////
// ////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1));

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// //child element
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   console.log('TARGET ', e.target, e.currentTarget); //target = where the event originated, not where the event is attached, currentTarget = where the event is attached to
//   console.log('CUR TARGET ', e.currentTarget);
//   this.style.backgroundColor = randomColor();
//   console.log(e.currentTarget === this);

//   // //stop event propagation
//   // e.stopPropagation(); //not a good idea
// });

//parent element
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   // console.log('LINK');
//   //if an event happens, and we click on the child element in this case, the event bubbles up to the parent element too, and both will get the same new random color
//   //but if we click only on the nav_links and not on nav_link elements the event will happen only in the parent and bubbles upwards from there
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER ', e.target, e.currentTarget); //target = where the event originated, not where the event is attached, currentTarget = where the event is attached to
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     // console.log('LINK');
//     const btn = e.target.closest('.nav__link');
//     if (!btn) return;
//     this.style.backgroundColor = randomColor();
//     btn.style.backgroundColor = randomColor();
//     console.log('NAV ', e.target, e.currentTarget); //target = where the event originated, not where the event is attached, currentTarget = where the event is attached to
//   },
//   true
// ); //true = will no longer listen for bubbling events, only for capture events
// //in practice it's the same as the addEventListener only works in the bubbling phase
// //but in the log we can see that this happens first even if we click on the child element, so in this case the navigation is the first element through which the event passes because now the element is actually listening for the event as it travels down (capturing) through the DOM and the other ones are listening as it travels up (bubbling)

// ////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////
// //////////////////// TRAVERSING THE DOM ////////////////////
// ////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////

// const h1 = document.querySelector('h1');

// //going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children); //live collection
// h1.firstElementChild.style.color = 'white';

// //going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)'; //the closest parent element that has the header class
// h1.closest('h1').style.background = 'var(--gradient-primary)'; //basically closest() is the oposite of querySelector()

//Going sideways: siblings
// console.log(h1.previousElementSibling, h1.nextElementSibling);
// console.log(h1.parentElement.children); // now we get all the siblings
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

// ////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////
// ///////////////// INTERSECTION OBSERVER API ////////////////
// ////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////

//this API allows us to observe changes to the way that a certain target element intersects another element or the way that it intersects the viewpoint

// const observerCallback = function (entries, observer) {
//   //entries is an array, threshold can be too
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const observerOptions = {
//   root: null, //the element that the target is intersecting, null=> viewport
//   threshold: [0, 0.2], //the % of intersection where the callback fcn will be called
//   //the event will trigger when entering/exiting the target (0%)
//   //and when reaching 20% of the target and when exiting the 20%
// };

// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(section1); //target = section1

//////////////////////////////////////////////LIFECYCLE DOM EVENTS////////////////////////////

// document.addEventListener('DOMContentLoaded', function (e) {
//   //this event does not wait for images and other external resources to load, just HTML and JS need to be loaded
//   console.log('HTML parsed and DOM tree built!', e);
// });
// window.addEventListener('load', function (e) {
//   console.log('Page fully loaded');
// });

// ////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////
// ///////////////// EFFICIENT SCRIPT LOADING /////////////////
// ////////////////////// DEFER AND ASYNC /////////////////////
// ////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////

// asyns/defer attributes of the <script> are gonna influence the way in which the JS file is fetched (downloaded and then executed)
