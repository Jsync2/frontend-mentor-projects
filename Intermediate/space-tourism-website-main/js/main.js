import { loadPartial } from "./partials.js";
import { getDataByKey } from './utils/dataManager.js';

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartial("header", "/partials/header.html");
  setupNavigation();
  highlightActiveNav();
});
const setupNavigation = () => {
  let isOpen = false;
  // Use event delegation on the document
  document.addEventListener("click", (e) => {
    if (e.target.closest("#hamNav") || e.target.closest("#closeNav")) {
      toggleMenu();
    }
  });
  const toggleMenu = () => {
    const mainMenu = document.getElementById('mainNav');
    const closeMenu = document.getElementById('closeNav');
    const openMenu = document.getElementById('hamNav');
    const navList = document.getElementById('navList');
    // Check if all elements exist
    if (!mainMenu || !closeMenu || !openMenu || !navList) {
      console.error('Navigation elements not found');
      return;
    }
    isOpen = !isOpen;
    if (isOpen) {
      // Open menu
      mainMenu.classList.remove('hidden');
      closeMenu.classList.remove('hidden');
      openMenu.classList.add('hidden');
      
      requestAnimationFrame(() => {
        navList.classList.remove('translate-x-full');
        navList.classList.add('translate-x-0');
      });
    } else {
      // Close menu
      navList.classList.add('translate-x-full');
      navList.classList.remove('translate-x-0');
      closeMenu.classList.add('hidden');
      openMenu.classList.remove('hidden');
      
      setTimeout(() => {
        mainMenu.classList.add('hidden');
      }, 500);
    }
  };
};
// Variables
const elements = {
  destinationImg: document.getElementById('destination-img'),
  destinationName: document.getElementById('destination-name'),
  destinationDescription: document.getElementById('description'),
  destinationDistance: document.getElementById('distance'),
  destinationTravel: document.getElementById('travel'),
  destNav: document.querySelectorAll('.destination-nav li'),

  crewRole: document.getElementById('crew-role'),
  crewName: document.getElementById('crew-name'),
  crewBio: document.getElementById('crew-bio'),
  crewImg: document.getElementById('crew-img'),
  crewNav: document.querySelectorAll('#crew-nav li'),

  techImg: document.getElementById('tech-img'),
  techName: document.getElementById('tech-name'),
  techDescription: document.getElementById('tech-description'),
  techNav: document.querySelectorAll('#tech-nav li'),
};
// Functions
function changeDestination(index) {
  getDataByKey('destinations').then(destinations => {
    if (!elements.destinationImg) return;

    elements.destinationImg.src = destinations[index].images.webp;
    elements.destinationName.textContent = destinations[index].name;
    elements.destinationDescription.textContent = destinations[index].description;
    elements.destinationDistance.textContent = destinations[index].distance;
    elements.destinationTravel.textContent = destinations[index].travel;
  });
};      
function changeCrew(index) {
  getDataByKey('crew').then(crew => {
    if (!elements.crewRole) return;
    
    elements.crewRole.textContent = crew[index].role;
    elements.crewName.textContent = crew[index].name
    elements.crewBio.textContent = crew[index].bio;
    elements.crewImg.src = crew[index].images.webp;
  });
};
function changeTech(index) {
  getDataByKey('technology').then(tech => {
    if (!elements.techImg) return;
    elements.techName.textContent = tech[index].name;
    elements.techDescription.textContent = tech[index].description;

    function changeTechImg() {
      if (window.innerWidth >= 1024) {
        elements.techImg.src = tech[index].images.portrait;
      } else if (window.innerWidth >= 768) {
        elements.techImg.src = tech[index].images.landscape;
      }else {
        elements.techImg.src = tech[index].images.portrait;
      }
    };
    changeTechImg();
    window.addEventListener('resize', changeTechImg);
  });
};
//Event listeners
elements.destNav.forEach((button, index) => {
  button.addEventListener('click', () => {
    elements.destNav.forEach(tab => tab.classList.remove('active'));
    button.classList.add('active');
    changeDestination(index);
  });
});
elements.crewNav.forEach((button, index) => {
  button.addEventListener('click', () => {
    elements.crewNav.forEach(tab => tab.classList.remove('active'));
    button.classList.add('active');
    changeCrew(index);
  });
});
elements.techNav.forEach((button, index) => {
  button.addEventListener('click', () => {
    elements.techNav.forEach(tab => tab.classList.remove('active'));
    button.classList.add('active');
    changeTech(index);
  });
});

// Set first tab as active on page load
if (elements.destNav.length > 0) elements.destNav[0].classList.add('active');
if (elements.crewNav.length > 0) elements.crewNav[0].classList.add('active');
if (elements.techNav.length > 0) elements.techNav[0].classList.add('active');

changeDestination(0);
changeCrew(0);
changeTech(0);

function highlightActiveNav() {
  const navTabs = document.querySelectorAll('#navList [role="tab"]');
  const currentPath = window.location.pathname.replace(/^\//, ''); // e.g. "about.html" from "/about.html"

  navTabs.forEach(tab => {
    const link = tab.querySelector('a');
    if (link) {
      let href = link.getAttribute('href') || "";
      href = href.replace(/^\.?\//, ''); // removes "./" or "/" from start
      if (href === currentPath) {
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.setAttribute('aria-selected', 'false');
      }
    }
  });
}