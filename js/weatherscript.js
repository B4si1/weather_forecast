// API key for accessing weather data


// DOM elements for user input, weather information, and error handling
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const alertInfo = document.getElementById('alertInfo');
const airQuality = document.getElementById('airQuality');
const uvQuality = document.getElementById('uvQuality');
const errorPopup = document.getElementById('popup');
const fadePopup = document.getElementById('fade');
const infoElement = document.getElementById('infoElement');
// Get references to the DOM elements with IDs 'sun' and 'moon'
const sun = document.getElementById('sun');
const moon = document.getElementById('moon');

// Variable to keep track of the currently focused suggestion
let focusedSuggestionIndex = -1;

// Importing data from external files
import { apiKey } from "../data/utils.js";
import palettes from "../data/weathers.js";
import commonCities from "../data/cities.js";
import {clearSuggestions} from "../data/utils.js";
import {formatString} from "../data/utils.js";
import {formatDayWithSuffix} from "../data/utils.js";
import {airCondition} from "../data/utils.js";
import {uvCondition} from "../data/utils.js";
import {truncateText} from "../data/utils.js";

// Function to render weather information on the UI
function renderWeather(data) {
  // Extracting necessary data from the provided 'data' object
  const location = data.location;
  const currentWeather = data.current;
  const forecast = data.forecast;
  const alerts = data.alerts.alert;
  const trimTime = data.location.localtime.slice(10);
  
  // console.log(location);
  // console.log(currentWeather);
  // console.log(currentWeather.last_updated);
  // console.log(forecast);
  // console.log(forecast.forecastday[0].day.daily_chance_of_rain);
  // console.log(typeof(forecast.forecastday[1].date))
  // console.log(alerts);
  // console.log(data.alerts.alert);

  infoElement.innerHTML = `Last API Update : ${currentWeather.last_updated}`

  const forecastContainer = document.getElementById("forecast");
  for(let i = 0; i < forecast.forecastday.length; i++){
    const dayContainer = document.getElementById(`day-${i + 1}`);
    const dateString = forecast.forecastday[i].date;
    const dateObject = new Date(dateString);
      dayContainer.innerHTML = `
        <h3 class="forcast-img">${formatDayWithSuffix(dateObject)}</h3>
        <p class="forcast-img">${truncateText(forecast.forecastday[i].day.condition.text, 22)}</p>
        <p class="forcast-img"><img src="${forecast.forecastday[i].day.condition.icon}" alt="Weather Icon"></p>
        <br>
        <p class="underline"><strong><span>${forecast.forecastday[i].day.avgtemp_c}°C / ${forecast.forecastday[i].day.avgtemp_f}°F</strong></span></p>
        <p class="underline"><strong>Rain Chance:</strong> <span>${forecast.forecastday[i].day.daily_chance_of_rain}%</span></p>
        <p class="underline"><strong >Max Temp:</strong> <span>${forecast.forecastday[i].day.maxtemp_c}°C / ${forecast.forecastday[i].day.maxtemp_f}°F</span></p>
        <p class="underline"><strong >Min Temp:</strong> <span>${forecast.forecastday[i].day.mintemp_c}°C / ${forecast.forecastday[i].day.mintemp_f}°F</span></p>
        `;
        
        
        for(let j = 0; j < palettes.length; j++){
          if(formatString(palettes[j].day) === formatString(forecast.forecastday[i].day.condition.text)){
            // console.log('enter loop');
            // console.log(formatString(palettes[j].day + " " + forecast.forecastday[i].day.condition.text));
            dayContainer.style.backgroundImage = `linear-gradient(transparent, ${palettes[j].color2})`;
          }        
         
        }
        
      forecastContainer.appendChild(dayContainer);
  };


  // Reset sun and moon animation and display properties
  sun.style.animation = 'none';
  moon.style.animation = 'none';
  sun.offsetHeight; 
  moon.offsetHeight;
  sun.style.animation = null;
  moon.style.animation = null;
  moon.style.display = 'none'; 
  sun.style.display = 'none'; 

  // Function to check if it is day or night
   function isDay(){
      if (currentWeather.is_day > 0){
        sun.style.display = 'block';
        return true;
      } else {
        moon.style.display = 'block';
        return false;
      }
    }

  // Generating HTML content for weather information
  const weatherHTML = `
    <div class="summary-fill">
      <h1>${location.name}, <span class="countryText">${truncateText(location.country, 10)}<span></h1>
      <p class="p-sml">${trimTime}</p> 
      <h1>${currentWeather.temp_c}<small>°C</small> / ${currentWeather.temp_f}<small>°F</small> </h1>
      <div class="p-update">Last API Update: ${currentWeather.last_updated}</div>
    </div>
    <div class="summary">
      <div class="summary1">
        <p class="forcast-img"><strong> ${truncateText(currentWeather.condition.text, 15)} </strong></p>  
        <p><strong>Feels like:</strong> ${currentWeather.feelslike_c}<small>°C</small> / ${currentWeather.feelslike_f}<small>°F</small></p>
        <p><strong>Humidity:</strong> ${currentWeather.humidity}<small>%</small></p>
        <p><strong>Wind:  </strong>${currentWeather.wind_mph}<small>mph</small> | ${currentWeather.wind_dir} ${currentWeather.wind_degree}<small>°</small> </p>
      </div>
      <div class="summary2">
        <p><strong>Visibility:  </strong>${currentWeather.vis_km}<small>km</small> / ${currentWeather.vis_miles}<small>miles</small></p>
        <p><strong>Carbon monoxide:  </strong>${currentWeather.air_quality.co}<small>ppm</small></p>
        <p><strong>Nitrogen dioxide:  </strong>${currentWeather.air_quality.no2}<small>ppm</small></p>
        <p><strong>Sulfur dioxide:  </strong>${currentWeather.air_quality.so2}<small>ppm</small></p>
      </div>
    </div>
    `;


  const airQualityInfo = `<strong>Air Quality :</strong>  ${airCondition(currentWeather.air_quality.pm2_5)} (${currentWeather.air_quality.pm2_5} <small>PM2.5</small>)`
  const uvQualityInfo = `<strong>UV index :</strong>  ${uvCondition(forecast.forecastday[1].day.uv)}`


  airQuality.innerHTML = airQualityInfo;
  uvQuality.innerHTML = uvQualityInfo;
  // Setting the generated HTML to the innerHTML of a DOM element with id 'weatherInfo'
  weatherInfo.innerHTML = weatherHTML;

  if(palettes === undefined || palettes.length === 0){
    document.body.style.backgroundImage = `linear-gradient(whitesmoke, grey)`;
    } else {
   // Iterate through each palette in the 'palettes' array
   for (let i = 0; i < palettes.length; i++) { // (let i = palettes.length; i == 0; i--)
    // Check if it's daytime and the current weather condition matches the day palette
      if (isDay() && (formatString(palettes[i].day) === formatString(currentWeather.condition.text) || formatString(palettes[i].night) === formatString(currentWeather.condition.text))) {
        // Set the background gradient for the body based on the day palette
        document.body.style.backgroundImage = `linear-gradient(whitesmoke, ${palettes[i].color2})`;
        // Exit the loop
        break;
      } 
      // Check if it's nighttime and the current weather condition matches the night palette
      else if (!isDay() && (formatString(palettes[i].day) === formatString(currentWeather.condition.text) || formatString(palettes[i].night) === formatString(currentWeather.condition.text))) {
        // Set the background gradient for the body based on the night palette
       document.body.style.backgroundImage = `linear-gradient(black, ${palettes[i].color2})`;
        // Exit the loop
        break;
      } 
    }
  }

  
  //Alerts

  if (alerts.length == 0){
    // console.log('no alerts');
    alertInfo.innerHTML = 'No Alerts'
    alertInfo.style.display = 'none';
    } else {
    alertInfo.style.color = `whitesmoke`;
    alertInfo.innerHTML = `<marquee behavior="scroll" direction="left" scrollamount="9">
    | Event: ${data.alerts.alert[0].event}
    | Headline: ${data.alerts.alert[0].headline}
    | Areas: ${data.alerts.alert[0].areas} 
    | Category: ${data.alerts.alert[0].category}
    | Description: ${data.alerts.alert[0].desc} 
    
    </marquee>`;
    // alertInfo.innerHTML = `Example alert | Some storm here | Dont die here | 5:30 | goat`;
  }
  
}

// Function to get weather data based on user input
function getWeather() {
  // Get the trimmed value of the city input
  const city = cityInput.value.trim();

  // Display an error popup and return if the city input is empty
  if (!city) {
    errorPopup.style.display = 'block';
    fadePopup.style.display = 'block';
    return;
  }

  // Fetch weather data for the specified city
  fetchWeatherData(city);
  clearSuggestions();
}

// Function to fetch weather data from the API for a given city
function fetchWeatherData(city) {
  
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=yes&alerts=yes&tides=yes`;
  
  localStorage.setItem('currentCity', city);
  

  // Fetch data from the API, handle response, and render weather data or display an error
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      renderWeather(data);
      // renderLocationData(data);
      // renderForecastData(data);
      // renderAlertData(data);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      errorPopup.style.display = 'block';
      fadePopup.style.display = 'block';
    });
}

// Function to handle 'Enter' key press and trigger a search if input is valid
function searchPress(event){
  if (event.key == "Enter"){
    
    getWeather();
    clearSuggestions();
    
  }
}

// Function to suggest cities based on user input
function suggestCities(input) {
  input = input.toLowerCase();
  return commonCities.filter((city) => city.toLowerCase().startsWith(input));
}

// Function to handle keyboard navigation
function handleKeyboardNavigation(event) {
  const suggestions = document.querySelectorAll('.dropdown-content li');

  if (event.key === 'ArrowDown') {
    focusedSuggestionIndex = (focusedSuggestionIndex + 1) % suggestions.length;
  } else if (event.key === 'ArrowUp') {
    focusedSuggestionIndex = (focusedSuggestionIndex - 1 + suggestions.length) % suggestions.length;
  } else if (event.key === 'Enter' && focusedSuggestionIndex !== -1) {
    // If Enter key is pressed, select the focused suggestion
    const selectedCity = suggestions[focusedSuggestionIndex].textContent;
    document.getElementById('cityInput').value = selectedCity;
    getWeather();
    clearSuggestions();
  }

  // Highlight the focused suggestion
  suggestions.forEach((suggestion, index) => {
    suggestion.classList.toggle('focused', index === focusedSuggestionIndex);
  });
}

// Event listener for the 'Enter' key to trigger a search
document.getElementById('cityInput').addEventListener('keypress', function(event) {
  if (event.key == 'Enter') {
    searchPress(event);
  }
});

// Event listener to hide error popup when clicked
errorPopup.addEventListener('click', function(){
  errorPopup.style.display = 'none';
  fadePopup.style.display = 'none';
  clearSuggestions();
});

// Event listener for the 'Search' button click to trigger a search
document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('submitButton');
  button.addEventListener('click', getWeather);
  clearSuggestions();
});

// Event listener for input changes in the city input field
document.getElementById('cityInput').addEventListener('input', function () {
  const userInput = this.value.trim();
  const suggestionsList = document.getElementById('cityOutput');

  // Clear the suggestions list if the input is empty after trimming
  if (userInput === '') {
    suggestionsList.innerHTML = '';
    suggestionsList.classList.remove('show'); // Hide the suggestions list
    return; // Exit the function early
  }

  // Get suggestions based on user input
  const suggestions = suggestCities(userInput);

  // Clear the suggestions list before populating it with new suggestions
  suggestionsList.innerHTML = '';

  // Populate the suggestions list with the new suggestions
  suggestions.forEach((city) => {
    const li = document.createElement('li');
    li.textContent = city;
    suggestionsList.appendChild(li);
  });

  suggestionsList.classList.add('show'); // Show the suggestions list

  // Automatically select the first suggestion and focus on it
  focusedSuggestionIndex = 0;
  handleKeyboardNavigation({ key: 'ArrowDown', preventDefault: () => {} });

  // It initializes or resets the index to the first suggestion in the list.
  // handleKeyboardNavigation({ key: 'ArrowDown', preventDefault: () => {} });: 
  // This line calls the handleKeyboardNavigation function 
  // with an event object that simulates a keydown event for the ArrowDown key. 
  // The event object is created with an empty preventDefault function to 
  // prevent any default browser behavior associated with the ArrowDown key.

});

// Event listener for keydown events on the city input field
document.getElementById('cityInput').addEventListener('keydown', function (event) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault(); // Prevent default behavior for arrow keys
    handleKeyboardNavigation(event);
  } else if (event.key === 'Enter') {
    event.preventDefault(); // Prevent default behavior for Enter key
    const focusedIndex = focusedSuggestionIndex;
    const suggestions = document.querySelectorAll('.dropdown-content li');

    if (focusedIndex !== -1 && focusedIndex < suggestions.length) {
      // If there is a focused suggestion, use it
      const selectedCity = suggestions[focusedIndex].textContent;
      document.getElementById('cityInput').value = selectedCity;
    }

    getWeather();
    clearSuggestions();
  }
});

// Event listener for clicks on suggestion items
document.getElementById('cityOutput').addEventListener('click', function (event) {
  const clickedCity = event.target.textContent;
  document.getElementById('cityInput').value = clickedCity;
  getWeather();
  clearSuggestions();
});

// INITIAL CALLS
// Function to fetch and render weather data for Nairobi when the page loads
function onLoadWeather() {
  if(localStorage.getItem('currentCity') == 0){
    fetchWeatherData('London')
  }
  else{
    fetchWeatherData(localStorage.getItem('currentCity'));
  }
  
}

// Initialize the weather display when page loads
onLoadWeather();
// INITIAL CALLS

// Reload or Update function
// setInterval(function() {
//   location.reload();
// }, 30000);
// SAVE API CALLS