let data

fetch('./data.json').then(Response => Response.json()).then(json =>{
    data = json;
});
//daily button
document.getElementById('daily').addEventListener('click', () =>{
    for (let i = 0; i<6;i++){
        document.getElementById('cur-'+ data[i].title).textContent = data[i].timeframes.daily.current + "Hrs";
        document.getElementById('prev-'+ data[i].title).textContent = "Last Day - "+ data[i].timeframes.daily.previous+"Hrs";
    }
});
//weekly 
document.getElementById('weekly').addEventListener('click', () =>{
    for (let i = 0; i<6;i++){
        document.getElementById('cur-'+ data[i].title).textContent = data[i].timeframes.weekly.current + "Hrs";
        document.getElementById('prev-'+ data[i].title).textContent = "Last Week - "+ data[i].timeframes.weekly.previous+"Hrs";
    }
});
//monthly
document.getElementById('monthly').addEventListener('click', () =>{
    for (let i = 0; i<6;i++){
        document.getElementById('cur-'+ data[i].title).textContent = data[i].timeframes.monthly.current + "Hrs";
        document.getElementById('prev-'+ data[i].title).textContent = "Last Month - "+ data[i].timeframes.monthly.previous+"Hrs";
    }
});
