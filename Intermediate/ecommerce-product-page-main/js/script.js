const lightbox = document.getElementById('lightbox');
const lightboxOverlay = document.getElementById("lightboxOverlay");
const target = document.getElementById("overlay-slideshow");
const overlay = document.getElementById('overlay');
const cartNotif = document.querySelector('.header-action button');
const addToCart = document.getElementById('addToCart');
const cart = document.getElementById('cart');
const cartContainer = document.getElementById('cart-container');
const empty = document.getElementById('empty');
const cartItems = document.getElementById('cart-items'); 
const deleteItem = document.getElementById('delete');
let total = 0;
let quantity = 0;
let slides = document.querySelectorAll('.mySlide');
let slideIndex = 1;
showSlides(slideIndex);

slides.forEach(slide => {
    slide.addEventListener('click', () => {
        if (window.innerWidth >= 1024) {
            target.innerHTML = "";
            const clone = lightbox.cloneNode(true);
            const clonedThumbnails = clone.querySelectorAll('.thumbnail');

            clonedThumbnails.forEach((thumbnail, index) => {
                thumbnail.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    currentSlide(index + 1);
                    
                    const allSlides = clone.querySelectorAll('.mySlide');
                    allSlides.forEach(s => s.style.display = "none");
                    allSlides[index].style.display = "block";
                });
            });
            target.appendChild(clone);
            lightboxOverlay.style.display = "flex";
        }
    });
});
function closeLightbox() {
  document.getElementById("lightboxOverlay").style.display = "none";
}
function nextImage(n) {
    showSlides(slideIndex += n);
}
function currentSlide(n) {
  showSlides(slideIndex = n);
}
function showSlides(n){
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    slides.forEach(slide => {
        slide.style.display = "none";
    });

    slides[slideIndex - 1].style.display = "block";
}
function openMenu() {
    overlay.style.display = "block";
    document.getElementById("menu").style.width = "70%";
    document.getElementById("close").style.display = "block";
}
function closeMenu() {
    overlay.style.display = "none";
    document.getElementById("menu").style.width = "0";
    document.getElementById("close").style.display = "none";
}

window.addEventListener('resize', function(e) {
    if (window.innerWidth > 1024) {
        overlay.style.display = "none";
        document.getElementById("menu").style.width = "100%";
        document.getElementById("close").style.display = "none";
    } else {
        overlay.style.display = "none";
        document.getElementById("menu").style.width = "0";
        target.innerHTML = "";
        overlay.style.display = "none";
    }
});
function handleKeyPress(event, slideNumber) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    currentSlide(slideNumber);
  }
}
function addQuantity() {
    quantity += 1;
    document.getElementById('quantity').value = quantity;
}
function removeQuantity() {
    if (quantity > 0) {
        quantity -= 1;
        document.getElementById('quantity').value = quantity;
    }
}
addToCart.addEventListener('click', () => {
    if (quantity > 0) {
        cartNotif.style.setProperty('--after-display', 'block');
        cartNotif.style.setProperty('--text', `"${quantity}"`);
        empty.style.display = "none";
        cartItems.style.display = "block";
        total += 125 * quantity;
        document.querySelector('.cart-item-info p').textContent = "$125.00 x " + `${quantity}` + " $" + `${total}`;
    }
    document.getElementById('quantity').value = "0";
});

cart.addEventListener('click', () => {
    if (cartContainer.style.display === "block") {
        cartContainer.style.display = "none";
    } else {
        cartContainer.style.display = "block";
    }
});
deleteItem.addEventListener('click', () => {
    cartItems.style.display = "none";
    empty.style.display = "block";
    cartNotif.style.setProperty('--after-display', 'none');
    cartNotif.style.setProperty('--text', '0');
    total = 0;
});