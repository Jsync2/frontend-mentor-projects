// Mobile menu toggle
const hamburger = document.querySelector('.hamburger-menu');
const nav = document.querySelector('.main-navigation');
const closeBtn = document.querySelector('.nav-close');

function openMenu() {
  nav.classList.add('active');
  hamburger.style.display = 'none';
}

function closeMenu() {
  nav.classList.remove('active');
  hamburger.style.display = 'block';
}

hamburger.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);

// Close menu when clicking on links
const navLinks = document.querySelectorAll('.main-navigation a');
navLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Function to position the "SEE ALL" button based on screen size
function positionSeeAllButton() {
  const seeAll = document.getElementById('seeAll'); // Fixed: added document.
  const mobileContainer = document.querySelector('.creations-section .container');
  const desktopHeader = document.querySelector('.creations-header');
  
  if (!seeAll || !mobileContainer || !desktopHeader) {
    console.error('Required elements not found');
    return;
  }
  if (window.innerWidth < 768) {
    // Mobile: Move button after the grid
    mobileContainer.appendChild(seeAll);
  } else {
    // Desktop: Move button back to header
    desktopHeader.appendChild(seeAll);
  }
}
// Run on page load
window.addEventListener('load', positionSeeAllButton);
// Run on window resize
window.addEventListener('resize', positionSeeAllButton);
