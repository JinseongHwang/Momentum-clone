const weather = document.querySelector(".js-weather");

const API_KEY = "2778c64841c0d6f102cb80db9f9e4679";
const COORDS = "coords";

function getConditionIcon(condition) {
    switch(condition) {
        case "Thunderstorm":
            return '⛈';
            break;
        case "Drizzle":
        case "Mist":
            return '🌦';
            break;
        case "Rain":
            return '🌧';
            break;
        case "Snow":
            return '🌨';
            break;
        case "Atmosphere":
            return '🌫';
            break;
        case "Clear":
            return '☀';
            break;
        case "Clouds":
            return '☁';
            break;
    }
}

function getWeather(lat, lon) {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        ).then(function(response) {
            return response.json()
        }).then(function(json) {
            const condition = json.weather[0].main;
            const temperature = json.main.temp;
            const humidity = json.main.humidity;
            const windSpeed = json.wind.speed;
            const place = json.name;
            weather.innerText = 
                `Condition: ${getConditionIcon(`${condition}`)} ${condition}
                Temp: ${temperature}℃
                Humidity: ${humidity}%
                Wind speed: ${windSpeed}m/s
                City: ${place}`;
        })
}

function saveCoords(coordsObj) {
    localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

function handleGeoSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coordsObj = {
        latitude,
        longitude
    };
    saveCoords(coordsObj);
    getWeather(latitude, longitude);
}

function handleGeoError() {
    console.log("Failed to access user's location.");
}

function askForCoords() {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
}

function loadCoords() {
    const loadedCoords = localStorage.getItem(COORDS);
    if (loadedCoords === null) {
        askForCoords();
    } else {
        const parsedCoords = JSON.parse(loadedCoords);
        getWeather(parsedCoords.latitude, parsedCoords.longitude);
    }
}

function init() {
    loadCoords();
}

init();
