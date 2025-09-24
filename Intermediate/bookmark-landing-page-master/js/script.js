const createMobileMenu = () => {
    const elements = {
        overlay: document.getElementById('overlay'),
        closeMenu: document.getElementById('close'),
        openMenu: document.getElementById('hamburger'),
        menu: document.getElementById('menu'),
        mobileMenu: document.getElementById('mobileMenu'),
        login: document.getElementById('login'),
        li: document.querySelectorAll('#mobileMenu li'),
        nameLogo: document.getElementById('name'),
        circle: document.getElementById('circle'),
        tag: document.getElementById('tag')
    };
    let isOpen = false;
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const toggleMenu = (shouldOpen) => {
        isOpen = shouldOpen;
        
        elements.overlay?.classList.toggle('hidden', !isOpen);
        elements.closeMenu?.classList.toggle('hidden', !isOpen);
        elements.openMenu?.classList.toggle('hidden', isOpen);
        elements.menu?.classList.toggle('hidden', !isOpen);

        if (isOpen) {
            elements.login?.classList.remove('bg-red-400');
            elements.li?.forEach(li => li.classList.add('border-t', 'w-full'));
            elements.mobileMenu?.classList.add(
                'absolute', 'top-24', 'left-0', 'w-full', 'flex',
                'flex-col', 'justify-center', 'z-20', 'items-center', 'text-white'
            );
        }
        const colors = {
            name: isOpen ? 'white' : '#242A45',
            circle: isOpen ? 'white' : '#5267DF',
            tag: isOpen ? '#242A45' : 'white'
        };
        elements.nameLogo?.setAttribute('fill', colors.name);
        elements.circle?.setAttribute('fill', colors.circle);
        elements.tag?.setAttribute('fill', colors.tag);
    };
    const resetDesktopState = () => {
        if (mediaQuery.matches) {
            elements.openMenu?.classList.remove('hidden');
            elements.closeMenu?.classList.add('hidden');
            elements.overlay?.classList.add('hidden');
            elements.mobileMenu?.classList.remove('absolute','text-white','flex-col');
            elements.li?.forEach(li => li.classList.remove('border-t'));
            elements.login?.classList.add('bg-red-400');
            toggleMenu(false);
        }
    };
    elements.openMenu?.addEventListener('click', () => toggleMenu(true));
    elements.closeMenu?.addEventListener('click', () => toggleMenu(false));
    mediaQuery.addEventListener('change', resetDesktopState);
    resetDesktopState(); // Set initial state
};
document.addEventListener('DOMContentLoaded', createMobileMenu);

// FAQ functionality
const faqbtns = document.querySelectorAll(".faq-btn");
const faqAnswers = document.querySelectorAll(".faq-answer p");

const toggleAccordion = (button, answer) =>{
    const isOpen = !answer.classList.contains("max-h-0");

    faqAnswers.forEach(p =>{
        p.classList.add("max-h-0");
        p.classList.remove("max-h-40");
    });
    faqbtns.forEach(btn => {
        btn.querySelector('img').classList.remove('rotate-180');
    });

    if(!isOpen){
        answer.classList.remove("max-h-0");
        answer.classList.add("max-h-40");
        button.querySelector('img').classList.add('rotate-180');
    }
}
faqbtns.forEach((button, index) => {
    button.addEventListener('click', () => {
        toggleAccordion(button, faqAnswers[index]);
    });
});
// Tabs functionality
const tabData = [
    {
        image: "./images/illustration-features-tab-1.svg",
        title: "Bookmark in one click",
        description: "Organize your bookmarks however you like. Our simple drag-and-drop interface gives you complete control over how you manage your favourite sites."
    },
    {
        image: "./images/illustration-features-tab-2.svg",
        title: "Intelligent search",
        description: "Our powerful search feature will help you find saved sites in no time at all. No need to trawl through all of your bookmarks."
    },
    {
        image: "./images/illustration-features-tab-3.svg",
        title: "Share your bookmarks",
        description: "Easily share your bookmarks and collections with others. Create a shareable link that you can send at the click of a button."
    }
];
const tabs = document.querySelectorAll('.tab');
const tabImage = document.querySelector('.tab-image img');
const tabTitle = document.querySelector('.tab-content h2');
const tabDescription = document.querySelector('.tab-content p');

const updateTabContent = (index) =>{
    const data = tabData[index];

    tabImage.src = data.image;
    tabTitle.textContent = data.title;
    tabDescription.textContent = data.description;
};

const setActiveTab = (activeIndex) => {
  tabs.forEach(tab => {
    const link = tab.querySelector('a');
    link.classList.remove('text-blue-950');
    link.classList.add('text-grey-50');
    link.classList.remove("after:content-['']","after:absolute", "after:bottom-0", "after:left-1/2", "after:-translate-x-1/2", "after:border-b-4", "after:border-red-400", "after:w-1/2");
  // Update content
  });
  const activeLink = tabs[activeIndex].querySelector('a');
  activeLink.classList.add('text-blue-950');
  activeLink.classList.remove('text-grey-50');
  activeLink.classList.add("after:content-['']","after:absolute", "after:bottom-0", "after:left-1/2", "after:-translate-x-1/2", "after:border-b-4", "after:border-red-400", "after:w-1/2", "md:after:w-3/4");
  // Update content
  updateTabContent(activeIndex);
}
// Add click listeners to tabs
tabs.forEach((tab, index) => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveTab(index);
  });
});
// Set first tab as default active
setActiveTab(0);