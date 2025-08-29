const rateItems = document.querySelectorAll('#rate li');
const btn = document.getElementById('submit');
const thankState = document.getElementById('thankyouState');
const ratingState = document.getElementById('ratingState');
const selected = document.querySelector('#thankyouState span');
let rating = 0;

rateItems.forEach(li =>{
    li.addEventListener('focus', ()=>{
        rating = li.textContent;
        btn.disabled = false;
    })
})

btn.addEventListener('click',()=>{
    if (rating !== 0) {
        thankState.style.display = "flex";
        ratingState.style.display = "none";
        selected.textContent = "You seleceted "+rating+" out of 5";
    }
})