const currentCityEl = document.querySelector('#current-city');
const currentTemp = document.querySelector('#current-temp');
const currentIcon = document.querySelector('#current-icon');
const currentHumidity = document.querySelector('#current-humidity');
const currentWind = document.querySelector('#current-wind');
const currentUvindex = document.querySelector('#current-uvindex');
const forecastEl = document.querySelector('.forecastDisplay');
const inputCity = document.querySelector('#cityName');
const cityDisplayEl = document.querySelector('.city-history-display');
var currentCity = "Sydney";

function getCityName() {
    forecastEl.innerHTML = "";
    currentCity = titleCase(inputCity.value);
    getGeo(currentCity);
    inputCity.value = "";
}

// localStorage.clear()
function displayCityHistory() {
    var prevCities = JSON.parse(localStorage.getItem("cities"));
    cityDisplayEl.innerHTML = '';
    prevCities?.forEach((item) => {
        const cityDiv = document.createElement('div');
        const cityLink = document.createElement('a');
        cityLink.setAttribute('href', '##')
        cityDiv.setAttribute("class", "city");
        cityLink.innerHTML = item.city;
        cityLink.onclick = function () {
            forecastEl.innerHTML = "";
            getGeo(item.city);
        }
        cityDiv.appendChild(cityLink)
        cityDisplayEl.appendChild(cityDiv);
    })
}
function getGeo(currentCity) {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${currentCity}, AU&appid=f7926986a7f8a9f6a2f7973e8afc3bbd`;
    fetch(geoUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                if (!data[0] || data[0].name !== currentCity) {
                    alert('Error: ' + response.statusText);
                    return;
                }
                lat = data[0].lat;
                lon = data[0].lon;
                let city = currentCity;
                getWeather(city, lat, lon)

            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
}
getGeo(currentCity)

function getWeather(city, lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=f7926986a7f8a9f6a2f7973e8afc3bbd&units=metric`;
    fetch(weatherUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                storeCityName(city);
                displaycurrentCityWeather(city, data);
                displayForecast(data);
                displayCityHistory();
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
};

function displaycurrentCityWeather(city, data) {
    currentCityEl.textContent = city;
    currentTemp.textContent = Math.round(data.current.temp) + "℃";
    currentHumidity.textContent = data.current.humidity + "%";
    currentWind.textContent = data.current.wind_speed + "K/M";
    let uvIndex = data.current.uvi;
    currentUvindex.textContent = uvIndex;
    if (uvIndex >= 11) {
        currentUvindex.style.backgroundColor = "#B567A4"
    } else if (8 <= uvIndex && uvIndex <= 10) {
        currentUvindex.style.backgroundColor = "#E5320F"
    } else if (6 <= uvIndex && uvIndex <= 7) {
        currentUvindex.style.backgroundColor = "#F18B01"
    } else if (3 <= uvIndex && uvIndex <= 5) {
        currentUvindex.style.backgroundColor = "#FFF300"
    } else if (0 <= uvIndex && uvIndex <= 2) {
        currentUvindex.style.backgroundColor = "#3EA72C"
    }
    // currentIcon.src = `http://openweathermap.org/img/w/${data.current.weather[0].icon}.png`
    currentIcon.src = `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
}

function displayForecast(data) {
    for (let i = 1; i < 6; i++) {
        var forecastItem = document.createElement('div');
        var forecastItemDate = document.createElement('div');
        var forecastItemTemp = document.createElement('div');
        var forecastItemIcon = document.createElement('img');
        var forecastItemDescription = document.createElement('div');
        forecastItem.setAttribute('id', 'forecastItem')
        forecastItemDate.setAttribute('id', 'forecastDate')
        forecastItemTemp.setAttribute('id', 'forecastTemp')
        forecastItemIcon.setAttribute('id', 'icon');
        forecastItemDescription.setAttribute('id', 'forecastDescrip');
        var time = moment.unix(data.daily[i].dt).format("YYYY-MM-DD");
        forecastItemDate.textContent = time;
        forecastItemTemp.textContent = Math.round(data.daily[i].temp.day) + "℃";
        forecastItemIcon.src = `https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`;
        forecastItemDescription.textContent = data.daily[i].weather[0].main
        forecastItem.appendChild(forecastItemDate);
        forecastItem.appendChild(forecastItemIcon);
        forecastItem.appendChild(forecastItemTemp);
        forecastItem.appendChild(forecastItemDescription);
        forecastEl.appendChild(forecastItem)
    }
}

function titleCase(str) {
    let splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}

function storeCityName(item) {
    let cityList = JSON.parse(localStorage.getItem("cities")) || [];
    for (let i in cityList) {
        if (cityList[i].city === item) {
            return;
        }
    }
    cityList.push({ city: item })
    localStorage.setItem("cities", JSON.stringify(cityList))
}


