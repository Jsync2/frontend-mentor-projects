const btn = document.getElementById('submit');
const successMessage = document.getElementById('success');
const form = document.getElementById('form');
const inputs = form.querySelectorAll("input[type='text'], input[type='email'], textarea")



form.addEventListener('submit', (event)=>{
    event.preventDefault();

    let filled = true;
    inputs.forEach(input =>{
        if (input.value.trim() === "") {
            filled = false;
        }  
    });
    if (!filled) {
        inputs.forEach(element => {
            element.style.border = "1px solid red";
        });
        document.querySelectorAll(".error").forEach(el => {
            el.style.display = "block";
        });
    } else {
        inputs.forEach(element => {
            element.style.border = "1px solid var(--Grey-500-medium)";
        });
        document.querySelectorAll(".error").forEach(el => {
            el.style.display = "none";
        });
        successMessage.classList.add('show');

        setTimeout(() => {
            successMessage.classList.remove('show');
            location.reload();
        }, 3000);
    }
})