const form = document.getElementById('cta-form');
const err = document.getElementById('error');

form.addEventListener('submit', (e) =>{
    e.preventDefault();

    const email = form.uEmail.value; //getting value
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && emailPattern.test(email)) {
        localStorage.setItem('email', email);
        window.location.href = 'subscribed.html';
    } else {
        document.getElementById('error').style.color = 'red';
        document.querySelector('input').style.border = '1px solid red';
        document.querySelector('input').style.backgroundColor ='rgba(255, 84, 118,0.3)';
    }
});
