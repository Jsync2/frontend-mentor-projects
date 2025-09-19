let slideIndex = 1;
showSlides(slideIndex);

function mySlides(n) {
    showSlides(slideIndex += n);
}
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("hero-image");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
}

const navList = document.querySelector(".nav-list");
const navClose = document.querySelector(".nav-close");
const overlay = document.querySelector(".overlay");
function openNav(){
    navList.style.width = "100%";
    navList.style.display = "flex";
    navClose.style.display = "block";
    overlay.style.display = "block";
}
function closeNav(){
    navList.style.width = "0";
    navList.style.display = "none";
    navClose.style.display = "none";
    overlay.style.display = "none";
}