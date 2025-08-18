let tipAmount; 
let totalperPerson;
let bill;
let people;

window.onload = function(){
    let dis = document.querySelector('.reset-wrapper button');
    dis.disabled = true;
    dis.style.cursor = "not-allowed";
    document.querySelector('.reset-wrapper').style.opacity = 0.3;  
}
function btnCalculate(percentage){
    let {bill,people} = getData();
    if (isNaN(bill) || isNaN(people)) {
        document.getElementById("errorMessage").style.display = "block";
        document.getElementById("errorMessage").textContent = "Invalid Input";
    }else if(people <= 0){
        document.getElementById("errorMessage").style.display = "block";
        document.getElementById("errorMessage").textContent = "Can't be zero";
        console.log("error");
    }else{
        tipAmount = (bill * percentage / 100) / people;
        totalperPerson = (bill/people) + tipAmount;
        display(tipAmount,totalperPerson);
        document.getElementById("errorMessage").style.display = "none";
        let dis = document.querySelector('.reset-wrapper button');
        dis.disabled = false;
        dis.style.cursor = "pointer";
        document.querySelector('.reset-wrapper').style.opacity = 1;
    }
}
function display(tipAmount,totalperPerson){
    document.getElementById('amount-value').textContent = '$'+ parseFloat(tipAmount.toFixed(2));
    document.getElementById('total-value').textContent = '$'+ parseFloat(totalperPerson.toFixed(2));
}
function getData(){
    bill = parseFloat(document.getElementById('bill').value);
    people = parseFloat(document.getElementById('people').value);
    return {bill, people};
}
function resetInput(){
    document.getElementById('people').value = "";
    document.getElementById('bill').value = "";
    document.getElementById('amount-value').textContent = "";
    document.getElementById('total-value').textContent = "";
    document.getElementById('custom').value = "";
}