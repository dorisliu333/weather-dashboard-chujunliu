var currentCity = document.querySelector('#current-city');
var currentTemp = document.querySelector('#current-temp');
var currentHumidity = document.querySelector('#current-humidity');
var currentWind = document.querySelector('#current-wind');
var currentUvindex = document.querySelector('#current-uvindex');
var forecastEl = document.querySelector('.forecastDisplay')
function getWeather() {
    var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=sydney,au&APPID=f7926986a7f8a9f6a2f7973e8afc3bbd&units=metric'
    fetch(weatherUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                displayCurrentCityWeather(data);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
};


function getForecast(){
    var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=sydney,au&appid=f7926986a7f8a9f6a2f7973e8afc3bbd&units=metric"
    fetch(forecastUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                displayForecast(data);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
}
getForecast()

function displayCurrentCityWeather(data){
    currentCity.textContent = data.name;
    currentTemp.textContent = Math.round(data.main.temp)+ "℃";
    currentHumidity.textContent = data.main.humidity + "%";
    currentWind.textContent = data.wind.speed + "K/M";
}

function displayForecast(data){
    for(var i =0; i<data.list.length; i=i+8){
        var forecastItem =  document.createElement('div');
        var forecastItemDate = document.createElement('div');
        var forecastItemTemp = document.createElement('div');
        var forecastItemIcon = document.createElement('img');
        forecastItem.setAttribute('class','col-lg-2')
        forecastItemIcon.setAttribute('id','icon');
        forecastItemDate.textContent = data.list[i].dt_txt;
        forecastItemTemp.textContent = Math.round(data.list[i].main.temp)+ "℃";
        forecastItemIcon.src = `http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
        forecastItem.appendChild(forecastItemDate);
        forecastItem.appendChild(forecastItemIcon);
        forecastItem.appendChild(forecastItemTemp);
        forecastEl.appendChild(forecastItem)
    }

}

getWeather();
