const ApiKeys = require('./config/keys')

const OPENWEATHER_API_KEY = ApiKeys.OPENWEATHER_API_KEY;

const getWeatherInfo = city =>
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}`
  )
    .then(response => response.json())
    .then(data => {
      const kelvin = data.main.temp;
      const celsius = Math.round(kelvin - 273.15);
      return celsius;
    })
    .catch(error => console.log(error));

export default getWeatherInfo;
