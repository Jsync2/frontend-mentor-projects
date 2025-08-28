const toggle = document.getElementById('theme-toggle');
const menu = document.getElementById('start-menu');
const topic = document.getElementById('question');
const result = document.getElementById('scoring');
const noAns = document.getElementById('no-ans');
const body = document.body;
const qt = window.matchMedia("(min-width: 1024px)");

let data;
fetch("./data.json").then(Response => Response.json()).then(json =>{
    data = json;
})

toggle.addEventListener('click', () =>{
    if (document.body.classList.contains('darkMode')) {
        document.body.classList.remove('darkMode')
        modeEvent();
    } else {
        document.body.classList.toggle('darkMode');
        modeEvent();
    }
});
window.addEventListener('resize', (modeEvent));
qt.addEventListener('change', displaySize);
modeEvent();

/* MODE FUNCTION */
function modeEvent(){
    const light = document.getElementById('light');
    const dark = document.getElementById('dark');
    const width = window.innerWidth;
    if (toggle.checked) {
        if (width <= 767) {
            body.style.background = "var(--blue-900) url('./assets/images/pattern-background-mobile-dark.svg') no-repeat";
        } else if(width <= 1023){
            body.style.background = "var(--blue-900) url('./assets/images/pattern-background-tablet-dark.svg') no-repeat";
        }else{
            body.style.background = "var(--blue-900) url('./assets/images/pattern-background-desktop-dark.svg') no-repeat";
        }   
        light.src = "./assets/images/icon-sun-light.svg"
        dark.src = "./assets/images/icon-moon-light.svg"
    } else {
        if (width <= 767) {
            body.style.background = "var(--grey-50) url('./assets/images/pattern-background-mobile-light.svg') no-repeat";
        } else if(width <= 1023){
            body.style.background = "var(--grey-50) url('./assets/images/pattern-background-tablet-light.svg') no-repeat";
        } else{
            body.style.background = "var(--grey-50) url('./assets/images/pattern-background-desktop-light.svg') no-repeat";
        }
        light.src = "./assets/images/icon-sun-dark.svg"
        dark.src = "./assets/images/icon-moon-dark.svg"
    }
}
let i;
let progress = 10;
let choiceIndex = 0;
const choice = document.querySelectorAll('.opt-text');

/*TOPIC FUNCTION*/
function quizHtml(){
    document.getElementById('icon').style.backgroundColor = "var(--orange-10)";
    document.getElementById('icon-result').style.backgroundColor = "var(--orange-10)";
    result.style.display = "none";
    i = 0;
    qPage();
    displaySize(qt);
    getData();
}
function quizCss(){
    document.getElementById('icon').style.backgroundColor = "var(--green-100)";
    document.getElementById('icon-result').style.backgroundColor = "var(--green-100)";
    result.style.display = "none";
    i = 1;
    qPage();
    displaySize(qt);
    getData();
}
function quizJs(){
    document.getElementById('icon').style.backgroundColor = "var(--blue-100)";
    document.getElementById('icon-result').style.backgroundColor = "var(--blue-100)";
    result.style.display = "none";
    i = 2;
    qPage();
    displaySize(qt);
    getData();
}
function quizAccess(){
    document.getElementById('icon').style.backgroundColor = "var(--purple-100)";
    document.getElementById('icon-result').style.backgroundColor = "var(--purple-100)";
    result.style.display = "none";
    i = 3;
    qPage();
    displaySize(qt);
    getData();
}

let correctIcon ="";
let correctAnswer = 0;
let isAnscheck = false;
const btn =document.getElementById("submit");

btn.addEventListener('click', function(){
    let selected = document.querySelector('input[name="choice"]:checked');
    const radios = document.querySelectorAll('input[name="choice"]');
    
    if (selected) {
        correctIcon.src = "";
        noAns.style.display = "none";
        if (!isAnscheck) {
            verifyAns(selected);
            btn.textContent = "Next Question";
            isAnscheck = true;
            console.log("isansw is now true");

            radios.forEach(radio =>{
                radio.disabled = true;
            });
        } else {
            selected.nextElementSibling.classList.remove("correct");
            selected.nextElementSibling.classList.remove("wrong");
            selected.checked = false;
            btn.textContent = "Submit Answer";
            isAnscheck = false;
            console.log("isansw is now false");

            radios.forEach(radio =>{
                radio.disabled = false;
            });
            if (choiceIndex === 10) {
                score();
            }
            getData();
            qPage();
        }
    } else {
        noAns.style.display = "flex";
    }
})
function verifyAns(selected){
    let answer = data.quizzes[i].questions[choiceIndex].answer;
    
    if (selected) {
        let span = selected.parentElement.querySelector('.opt-text');
        let chosenAnswer = span.textContent;
        if (chosenAnswer === answer) {
            selected.nextElementSibling.classList.toggle("correct");
            correctAnswer += 1;
        } else {
            selected.nextElementSibling.classList.toggle("wrong");
            let options = document.querySelectorAll('.opt-text');
            options.forEach(opt => {
                if (opt.textContent === answer) {
                    correctIcon = opt.parentElement.querySelector('.mark');
                    correctIcon.src = "./assets/images/icon-correct.svg"; 
                }
            })
        }
        choiceIndex ++;
        progress += 10;
    } else {
        console.log("no option selected");
    }
}
function score(){
    topic.style.display = "none"
    result.style.display = "block"
    document.querySelector('#topic-result div span').textContent = data.quizzes[i].title;
    document.getElementById('icon-result').src = data.quizzes[i].icon;
    document.getElementById('score').textContent = correctAnswer;
    displaySize(qt);
    qPage();
}
function getData(){
    document.getElementById('questionaire').textContent = data.quizzes[i].questions[choiceIndex].question;
    document.querySelector("#question-number small").textContent = "Question "+(choiceIndex+1)+" of 10";
    document.getElementById('progress-bar').style.width = progress + "%";
    
    choice.forEach((block, index) => {
        block.textContent = data.quizzes[i].questions[choiceIndex].options[index];
    });
}
function qPage(){
    menu.style.display = "none";
    document.getElementById('topic').style.display ='flex';
    document.querySelector('#topic span').textContent = data.quizzes[i].title;
    document.getElementById('icon').src = data.quizzes[i].icon;
    document.querySelector('header').style.justifyContent = 'space-between';
}
function playAgain(){
    location.reload();
}
/*EXTRA FUNCTION FOR SCREEN SIZE*/
function displaySize(e){
    if (e.matches && menu.style.display === "none" && result.style.display === "none") {
        topic.style.display = "flex";
    } else if(menu.style.display === "none" && result.style.display === "none"){
        topic.style.display = "block";
    }
    if (e.matches && menu.style.display === "none" && topic.style.display === "none") {
        result.style.display = "flex";
    }else if(menu.style.display === "none" && topic.style.display === "none"){
        result.style.display = "block";
    }
}
