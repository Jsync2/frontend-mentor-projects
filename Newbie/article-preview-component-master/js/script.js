const btn = document.getElementById("btn-share");
const popup = document.getElementById("social-icons");

btn.addEventListener("click", ()=>{
    popup.classList.toggle("show");
    btn.classList.toggle('btn-bg');
});
document.addEventListener("click", (e) =>{
    if (!btn.contains(e.target) && !popup.contains(e.target)){
        btn.classList.remove("btn-bg");
        popup.classList.remove("show");
    }
});