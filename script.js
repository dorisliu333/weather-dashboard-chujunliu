var currentCityEl = document.querySelector('#current-city');
var currentTemp = document.querySelector('#current-temp');
var currentHumidity = document.querySelector('#current-humidity');
var currentWind = document.querySelector('#current-wind');
var currentUvindex = document.querySelector('#current-uvindex');
var forecastEl = document.querySelector('.forecastDisplay');
var inputCity = document.querySelector('#cityName');
var cityDisplayEl = document.querySelector('.city-history-display');
var currentCity = "Sydney";


function getCityName(){
    forecastEl.innerHTML="";
    currentCity = titleCase(inputCity.value);
    getWeather(currentCity);
    inputCity.value="";
}

// localStorage.clear()
function displayCityHistory(){
    var prevCities =  JSON.parse(localStorage.getItem("cities"));
    // console.log(prevCities.length)
    cityDisplayEl.innerHTML='';
    prevCities?.forEach((item) => {
        const cityDiv = document.createElement('div');
        const cityLink = document.createElement('a');
        cityLink.setAttribute('href','##')
        cityDiv.setAttribute("class", "city");
        cityLink.innerHTML = item.city;
        cityLink.onclick = function (){
            forecastEl.innerHTML="";
            getWeather(item.city);
        }
        cityDiv.appendChild(cityLink)
        cityDisplayEl.appendChild(cityDiv);
    })
}


function getWeather(currentCity) {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&APPID=f7926986a7f8a9f6a2f7973e8afc3bbd&units=metric`;
    fetch(weatherUrl).then(function (response) {
        if (response.ok) {
            storeCityName(currentCity);
            response.json().then(function (data) {
                displaycurrentCityWeather(data);
                getForecast(currentCity);
                displayCityHistory();
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
};
getWeather(currentCity);


function getForecast(currentCity){
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity}&appid=f7926986a7f8a9f6a2f7973e8afc3bbd&units=metric`;
    fetch(forecastUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data)
                displayForecast(data);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
}

function displaycurrentCityWeather(data){
    currentCityEl.textContent = data.name;
    currentTemp.textContent = Math.round(data.main.temp)+ "℃";
    currentHumidity.textContent = data.main.humidity + "%";
    currentWind.textContent = data.wind.speed + "K/M";
}

function displayForecast(data){
    for(var i =6; i<data.list.length; i=i+8){
        var forecastItem =  document.createElement('div');
        var forecastItemDate = document.createElement('div');
        var forecastItemTemp = document.createElement('div');
        var forecastItemIcon = document.createElement('img');
        var forecastItemDescription = document.createElement('div');
        forecastItem.setAttribute('id','forecastItem')
        forecastItemDate.setAttribute('id','forecastDate')
        forecastItemTemp.setAttribute('id','forecastTemp')
        forecastItemIcon.setAttribute('id','icon');
        forecastItemDescription.setAttribute('id','forecastDescrip');
        var time  = data.list[i].dt_txt.split(' ')[0];
        forecastItemDate.textContent = time;
        forecastItemTemp.textContent = Math.round(data.list[i].main.temp)+ "℃";
        forecastItemIcon.src = `http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
        forecastItemDescription.textContent = data.list[i].weather[0].main
        forecastItem.appendChild(forecastItemDate);
        forecastItem.appendChild(forecastItemIcon);
        forecastItem.appendChild(forecastItemTemp);
        forecastItem.appendChild(forecastItemDescription);
        forecastEl.appendChild(forecastItem)
    }
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
 }


 function storeCityName(item) { 
    var  cityList = JSON.parse(localStorage.getItem("cities")) || [];
    for (var i in cityList) {
        if (cityList[i].city === item){
            return;
        }
    }
    cityList.push({ city: item })
    localStorage.setItem("cities", JSON.stringify(cityList))
}


