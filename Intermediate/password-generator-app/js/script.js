const passOut = document.getElementById("passInput");
const slider = document.getElementById("slider");
const result = document.getElementById("result");
const indText = document.getElementById("ind-name");
const copy = document.getElementById("copyIcon");

let red = "background-color: var(--Red-500);border: 2px solid var(--Red-500);";
let orange = "background-color: var(--Orange-400);border: 2px solid var(--Orange-400);";
let yellow = "background-color: var(--Yellow-300);border: 2px solid var(--Yellow-300);";
let green = "background-color: var(--Green-200);border: 2px solid var(--Green-200);";
let reset = "border: 2px solid white;margin: 0 0.2rem;padding: 0.2rem;"

result.textContent = slider.value;

slider.addEventListener("input", () => {
    let val = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, #a3ffae ${val}%, #191820 ${val}%)`;
    result.textContent = slider.value;
});

copy.style.color = 'white';

  function generatePass(){
    const length = parseInt(slider.value);
    const upper = document.getElementById("Uletters").checked
    const lower = document.getElementById("Lletters").checked;
    const number = document.getElementById("checkNumbers").checked;
    const symbs = document.getElementById("checkSymbols").checked;

    copy.style.color = "var(--Green-200)";

    let charset = '';
    if (upper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (number) charset += '0123456789';
    if (symbs) charset+= '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
        alert("Checked at least one character type!");
        return;
    }
    let password = '';
    for (let index = 0; index < length; index++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));     
    }
    passOut.value = password;
    calculateStrength(password);
    
  }
  copy.addEventListener("click", () => {
    if (passOut.value) {
        copyPass();
    }else{
        alert("No text to Copy!")
    }
})
  function calculateStrength(password){
    let score = 0;
    
    // Length scoring
    if (password.length >= 12) score += 25;
    else if (password.length >= 8) score += 15;
    else if (password.length >= 6) score += 5;

    // Character variety scoring
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;

    // Bonus points for good practices
    if (password.length >= 16) score += 10;
    if (/[!@#$%^&*()_+\-=\[\]{}|;':\",./<>?]/.test(password)) score += 5;

    // Reset Bar Indicator
    for (i=1; i <= 4; i++) {
        document.getElementById('bar'+ i).style.cssText = reset;
    }

    // Determine strength level
    let strength, bar, color;
    if (score >= 80) {
        strength = 'VERY STRONG';
        bar = 4;
        color = green;
    } else if (score >= 55) {
        strength = 'STRONG';
        bar = 3;
        color = yellow;
    } else if (score >= 30) {
        strength = 'MEDIUM';
        bar = 2;
        color = orange;
    } else{
        strength = 'WEAK';
        bar = 1;
        color = red;
    }
    // Update Indicator
    indText.textContent = strength;
    for (i=1; i <= bar; i++) {
        document.getElementById('bar'+ i).style.cssText = color;
    }
    document.getElementById("passInput").style.color = "white";
  }
  function copyPass(){
    navigator.clipboard.writeText(passOut.value)
    .then(() => {
        alert("Copied");
    }).catch((err) => {
        console.error("Failed to Copy");
    });
    copy.style.color = 'white';
}