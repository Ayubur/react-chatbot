const OPENWEATHER_API_KEY = "10e153c30a27e0311ddcfa2d11f9dd3a";

const getWeatherInfo = city =>
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}`
  )
    .then(response => response.json())
    .then(data => {
      const kelvin = data.main.temp;
      const celsius = Math.round(kelvin - 273.15);
      return celsius;
    })
    .catch(error => console.log(error));

module.exports = getWeatherInfo;
