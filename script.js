const currentCityEl = document.querySelector('#current-city');
const currentTemp = document.querySelector('#current-temp');
const currentIcon = document.querySelector('#current-icon');
const currentTime = document.querySelector('#current-time');
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
    const geoUrl = `http://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=f7926986a7f8a9f6a2f7973e8afc3bbd`
    $.ajax({
        type: "GET",
        url: geoUrl,
        dataType: "json",
        success: function (data) {
            lat = data.coord.lat;
            lon = data.coord.lon;
            let city = currentCity;
            getWeather(city, lat, lon)

        }
    })
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
let curTime = moment().format("YYYY-MM-DD");
function displaycurrentCityWeather(city, data) {
    let time = moment().format("YYYY-MM-DD");
    currentCityEl.textContent = city;
    currentTemp.textContent = Math.round(data.current.temp) + "℃";
    currentHumidity.textContent = data.current.humidity + "%";
    currentWind.textContent = data.current.wind_speed + "K/M";
    let uvIndex = data.current.uvi;
    currentUvindex.textContent = uvIndex;
    currentTime.textContent = curTime;
    if (uvIndex >= 11) {
        currentUvindex.style.backgroundColor = "#B567A4"
    } else if (8 <= uvIndex && uvIndex < 11) {
        currentUvindex.style.backgroundColor = "#E5320F"
    } else if (6 <= uvIndex && uvIndex < 8) {
        currentUvindex.style.backgroundColor = "#F18B01"
    } else if (3 <= uvIndex && uvIndex < 6) {
        currentUvindex.style.backgroundColor = "#FFF300"
    } else if (0 <= uvIndex && uvIndex < 3) {
        currentUvindex.style.backgroundColor = "#3EA72C"
    }
    currentIcon.src = `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
}

function displayForecast(data) {
    let time = moment.unix(data.daily[0].dt).format("YYYY-MM-DD");
    let i;
    curTime === time ? i =1 : i = 0;
    let length = 5+i;
    for (i ; i < length; i++) {
        var forecastItem = document.createElement('div');
        var forecastItemDate = document.createElement('div');
        var forecastItemTemp = document.createElement('div');
        var forecastItemIcon = document.createElement('img');
        var forecastItemHumidity = document.createElement('div');
        var forecastItemWind = document.createElement('div');
        forecastItem.setAttribute('id', 'forecastItem')
        forecastItemDate.setAttribute('id', 'forecastDate')
        forecastItemTemp.setAttribute('id', 'forecastTemp')
        forecastItemIcon.setAttribute('id', 'icon');
        forecastItemHumidity.setAttribute('id', 'forecastHumidity');
        forecastItemWind.setAttribute('id', 'forecastWind');    
        forecastItemDate.textContent = moment.unix(data.daily[i].dt).format("YYYY-MM-DD");
        forecastItemTemp.textContent = Math.round(data.daily[i].temp.day) + "℃";
        forecastItemIcon.src = `https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`;
        forecastItemHumidity.textContent = data.daily[i].humidity+"%";
        forecastItemWind.textContent = `${data.daily[i].wind_speed} K/M`;
        forecastItem.appendChild(forecastItemDate);
        forecastItem.appendChild(forecastItemIcon);
        forecastItem.appendChild(forecastItemTemp);
        forecastItem.appendChild(forecastItemHumidity);
        forecastItem.appendChild(forecastItemWind);
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


