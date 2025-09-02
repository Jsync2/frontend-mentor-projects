const navMenu = document.getElementById('navMenu');
const closebtn = document.getElementById('closebtn');
const overlay = document.getElementById('overlay'); 

function openNav() {
    navMenu.style.width = "20rem";
    closebtn.style.right = "4rem";
    overlay.style.display = "block";
}

function closeNav(){
    navMenu.style.width = "0";
    closebtn.style.right = "0";
    overlay.style.display = "none"; 
}
