let hour = document.getElementById("hour");
let min = document.getElementById("min");
let sec = document.getElementById("sec");

const date = new Date();
let dateHour = date.getHours();
let dateMin = date.getMinutes();
let dateSec = date.getSeconds();

setInterval(() => {
    min.innerHTML = dateMin
    hour.innerHTML = dateHour
    sec.innerHTML = dateSec;
    if (dateHour == 24){
        hour.innerHTML = 0 
    }
    if (dateMin == 60) {
        hour.innerHTML = dateHour++
        dateMin = 0
    }
    if (dateSec == 60) {
        min.innerHTML = dateMin++
        dateSec = 0
    }
    sec.innerHTML = dateSec++
}, 1000)

