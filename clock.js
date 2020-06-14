// This is JavaScript source
const clockContainer = document.querySelector(".js-clock");
const clockTitle = clockContainer.querySelector("h2");

function getTime() {
    const currDay = new Date()
    
    let hours = currDay.getHours();
    hours = hours < 10 ? `0${hours}` : hours;
    let minutes = currDay.getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    let seconds = currDay.getSeconds();
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    let milliseconds = Math.floor(currDay.getMilliseconds() / 10);
    milliseconds = milliseconds < 10 ? `0${milliseconds}` : milliseconds;

    clockTitle.innerText = `🕐${hours}:${minutes}:${seconds}:${milliseconds}`;
}

function init() {
    getTime();
    setInterval(getTime, 10);
}
init();
