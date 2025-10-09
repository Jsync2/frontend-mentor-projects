import './style.css'

const gallery = document.getElementById('gallery-container');
const slidshowToggle = document.getElementById('slidshowToggle');
const foot = document.createElement('footer');
const body = document.body;
let data =[];
let slideIndex = 1;
async function getData() {
    try {
        const response = await fetch('/data.json');
        data = await response.json();
    } catch (error) {
        console.error(error);
    }
}
async function getGallery() {
    await getData();
    data.forEach((item,index) => {
        const figure = document.createElement('figure');
        figure.classList.add('gallery-figure');
                
        const images = document.createElement('img');
        images.src = item.images.thumbnail;
        images.alt = 'hero';
        images.classList.add('gallery-img');

        figure.addEventListener('click', () => {
            slidshowToggle.textContent = 'STOP SLIDESHOW';
            gallery.innerHTML = '';
            gallery.classList.add('slideshow-mode');
            foot.style.display = 'flex';
            slideIndex = index + 1; // Set slideIndex to clicked image
            showSlides(slideIndex);
            controlSlide();
        });

        const title = document.createElement('figcaption');
        title.classList.add('gallery-title');
        title.textContent = item.name;

        const artist = document.createElement('p');
        artist.textContent = item.artist.name;
        artist.classList.add('gallery-artist');

        const gradient = document.createElement('div');
        gradient.classList.add('gallery-overlay');

        figure.appendChild(images);
        figure.appendChild(gradient);
        figure.appendChild(title);
        title.appendChild(artist);
        gallery.appendChild(figure);
    });
    imagesLoaded(gallery, () => {
        const msnry = new Masonry(gallery, {
            itemSelector: '.gallery-figure', // Changed from '.gallery-item'
            columnWidth: '.gallery-figure',  // Changed from '.gallery-item'
            gutter: 16,
            percentPosition: false, // Changed to false for better control
            horizontalOrder: false,
            fitwidth: true,
            transitionDuration: '0'
        });
        window.addEventListener('resize', () => {
            if (!gallery.classList.contains('slideshow-mode')) {
                msnry.layout();
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', getGallery);

slidshowToggle.addEventListener('click', () => {
    if (slidshowToggle.textContent === 'START SLIDESHOW') {
        slidshowToggle.textContent = 'STOP SLIDESHOW';
        gallery.innerHTML = '';
        gallery.classList.add('slideshow-mode');
        foot.style.display = 'flex';
        showSlides(slideIndex);
        controlSlide();
    } else {
        slidshowToggle.textContent = 'START SLIDESHOW';
        gallery.innerHTML = '';
        gallery.classList.remove('slideshow-mode');
        foot.innerHTML = '';
        foot.style.display = 'none';
        slideIndex = 1;
        getGallery();
    }
});
async function showSlides(n){
    await getData();
    if (n > data.length) {slideIndex = 1}
    if (n < 1) {slideIndex = data.length}

    const existingFooter = document.querySelector('.foot');
    if (existingFooter) {
        existingFooter.remove();
    }
    gallery.innerHTML = '';

    const section = document.createElement('section');
    section.className = 'flex flex-col justify-center items-center gap-38 lg:flex-row';

    const article = document.createElement('article');
    article.classList.add('article');

    const artist = document.createElement('p');
    artist.textContent = data[slideIndex - 1].artist.name;
    artist.classList.add('artist');
    
    const title = document.createElement('h1');
    title.textContent = data[slideIndex - 1].name;
    title.classList.add('title');

    const artistImg = document.createElement('img');
    artistImg.src = data[slideIndex - 1].artist.image;
    artistImg.alt = 'artist';
    artistImg.classList.add('artist-img');

    const div = document.createElement('div');
    div.classList.add('div');
    
    const imgElem = document.createElement('img');
    imgElem.src = window.innerWidth > 768
        ? data[slideIndex - 1].images.hero.large
        : data[slideIndex - 1].images.hero.small;
    imgElem.alt = data[slideIndex - 1].name;
    imgElem.classList.add('imgElem');

    window.addEventListener('resize', () => {
    imgElem.src = window.innerWidth > 768 
        ? data[slideIndex - 1].images.hero.large 
        : data[slideIndex - 1].images.hero.small;
    });

    const viewImg = document.createElement('img');
    viewImg.src = './assets/shared/icon-view-image.svg';
    viewImg.alt = 'view';
    viewImg.classList.add('view-img');

    gallery.appendChild(section);
    section.appendChild(div);
    section.appendChild(article);
    (() => {
        const year = document.createElement('p');
        const p = document.createElement('p');
        const goto = document.createElement('a');

        year.textContent = data[slideIndex - 1].year;
        year.classList.add('year');
        
        p.textContent = data[slideIndex - 1].description;
        p.classList.add('description');

        goto.href = data[slideIndex - 1].source;
        goto.classList.add('goto');
        goto.textContent = 'GO TO SOURCE';
        
        article.appendChild(p);
        article.appendChild(goto);
        article.appendChild(year);
    })();
    div.appendChild(imgElem);
    div.appendChild((() => {
    const details = document.createElement('div');
    details.classList.add('details');
    details.appendChild(title);
    details.appendChild(artist);
    details.appendChild(artistImg);
    
    const wrapper = document.createElement('div');
    wrapper.textContent = 'VIEW IMAGE';
    wrapper.classList.add('wrapper');
    wrapper.appendChild(viewImg);
    
    // Click handler for lightbox
    wrapper.addEventListener('click', () => {
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        
        const lightboxContent = document.createElement('div');
        lightboxContent.classList.add('lightbox-content');
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'CLOSE';
        closeBtn.classList.add('lightbox-close');
        
        const lightboxImg = document.createElement('img');
        lightboxImg.src = data[slideIndex - 1].images.gallery;
        lightboxImg.alt = data[slideIndex - 1].name;
        lightboxImg.classList.add('lightbox-img');
        
        lightboxContent.appendChild(closeBtn);
        lightboxContent.appendChild(lightboxImg);
        lightbox.appendChild(lightboxContent);
        body.appendChild(lightbox);
        
        // Prevent scrolling when lightbox is open
        body.style.overflow = 'hidden';
        
        closeBtn.addEventListener('click', () => {
            lightbox.remove();
            body.style.overflow = 'auto';
        });
        
        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.remove();
                body.style.overflow = 'auto';
            }
        });
    });
    const container = document.createElement('div');
    container.appendChild(wrapper);
    container.appendChild(details);

    return container;
})());
}
function controlSlide(){
    document.body.appendChild(foot);
    foot.className = 'flex flex-row-reverse justify-between items-center p-4 border-t-2 border-t-gray-150 relative';
    const details = document.createElement('div');
    const title = document.createElement('h1');
    const artist = document.createElement('p');

    const updateDetails = ()=>{
        title.textContent = data[slideIndex - 1].name;
        artist.textContent = data[slideIndex - 1].artist.name;

        const progress = (slideIndex / data.length) * 100;
        foot.style.borderImage = `linear-gradient(to right, black ${progress}%, #e5e5e5 ${progress}%) 1`;
    };
    updateDetails();

    title.textContent = data[slideIndex - 1].name;
    title.classList.add('title');
    title.className = 'text-[0.87rem] font-bold';
    artist.textContent = data[slideIndex - 1].artist.name;
    artist.classList.add('artist');
    artist.className = 'text-[0.625rem] font-normal opacity-75';

    const slideShowControls = document.createElement('div');
    slideShowControls.classList.add('slidshow-controls');

    foot.appendChild(slideShowControls);
    foot.appendChild(details);
    details.appendChild(title);
    details.appendChild(artist);
    
    const prev = document.createElement('img');
    prev.src = './assets/shared/icon-back-button.svg';
    prev.alt = 'prev';
    prev.className = 'cursor-pointer';

    const next = document.createElement('img');
    next.src = './assets/shared/icon-next-button.svg';
    next.alt = 'next';
    next.className = 'cursor-pointer';

    const updateButtonStates = () => {
        if (slideIndex <= 1) {
            prev.classList.add('opacity-50');
            prev.style.pointerEvents = 'none';
        } else {
            prev.classList.remove('opacity-50');
            prev.style.pointerEvents = 'auto';
        }    
    // Disable next button if at last slide
        if (slideIndex >= data.length) {
            next.classList.add('opacity-50');
            next.style.pointerEvents = 'none';
        } else {
            next.classList.remove('opacity-50');
            next.style.pointerEvents = 'auto';
        }
    };
    prev.addEventListener('click', () => {
        slideIndex--;
        showSlides(slideIndex).then(() => {
            updateDetails();
            updateButtonStates();
        });
    });
    next.addEventListener('click', () => {
        slideIndex++;    
        showSlides(slideIndex).then(() => {
            updateDetails();
            updateButtonStates();
        });
    });
    updateButtonStates();
    
    slideShowControls.appendChild(prev);
    slideShowControls.appendChild(next);
}
