// Constants
const key = secrets.key;
const baseUrl = `https://api.weatherapi.com/v1/`;

// Select container-box
const containerbox = document.querySelector("#container-box");
const search = document.querySelector("input");
let weatherData = {};

// Get Date Details
const getDateDetails = (dates) => {
    const dateDetails = new Date(dates);
    const weekDay = dateDetails.toLocaleDateString("en-US", { weekday: "long" });
    const day = dateDetails.toLocaleDateString("en-US", { day: "2-digit" });
    const month = dateDetails.toLocaleDateString("en-US", { month: "long" });
    return { weekDay, day, month };
}

// Display Weather Data
const displayWeatherData = (array) => {
    if (!containerbox) return;

    let box = ``;
    for (let i = 0; i < array.length; i++) {
        const { weekDay, day, month } = getDateDetails(array[i].date);
        box += `<div class="col-md-6 col-lg-4">
            <div class="card text-white">
                <div class="d-flex justify-content-between align-items-center fs-3">
                    ${i === 0 ? `<p>${weekDay}</p><p>${day} ${month}</p>` : `<p>${weekDay}</p>`}
                </div>
                <div class="fs-4">
                    ${i === 0 ? `
                        <p class="text-start">${weatherData.location.name}</p>
                        <div class="d-flex flex-column justify-content-between align-items-center">
                            <p class="display-2 fw-bold">${weatherData.current.temp_c} &deg;C</p>
                            <img src="${weatherData.current.condition.icon}" alt="Weather Logo">
                        </div>
                    ` : `
                        <p>${array[i].day?.maxtemp_c} &deg;C</p>
                        <p>${array[i].day?.mintemp_c} &deg;C</p>
                        <img src="${array[i].day?.condition.icon}" alt="Weather Logo"/>
                    `}
                </div>
                <p class="text-center fs-3">${i === 0 ? weatherData.current.condition.text : array[i].day?.condition.text}</p>
                ${i === 0 ? `
                    <div class="d-flex justify-content-between align-items-center py-2">
                        <span><i class="fa-solid fa-umbrella"></i>${array[0].day.daily_chance_of_rain}%</span>
                        <span><i class="fa-solid fa-wind"></i>${array[0].day.maxwind_kph} KM/H</span>
                        <span><i class="fa-solid fa-compass"></i>${weatherData.current.wind_dir}</span>
                    </div>
                ` : ``}
            </div>
        </div>`;
    }
    containerbox.innerHTML = box;
}

// Get Weather Forecast
const getWeather = async (param = search.value || "cairo") => {
    if (!param || param.length < 3) return;
    try {
        const response = await fetch(`${baseUrl}forecast.json?key=${key}&q=${param}&days=3`);
        const data = await response.json();
        if (data && data.forecast) {
            weatherData = data;
            displayWeatherData(data.forecast.forecastday);
        } else {
            console.log("Error: No forecast data available.");
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Handle Search Input
search.addEventListener("input", (e) => {
    getWeather(e.target.value);
});

// Get Current Location of User
window.navigator.geolocation.getCurrentPosition(
    (data) => getWeather(`${data.coords.latitude},${data.coords.longitude}`),
    () => getWeather()
);
