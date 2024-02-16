// This can be turned into a single function with params.
// todo : 
// - Seperate / organise js
// - fix dual selecting when kb and mouse are being used on the list - done

// API key for accessing weather data
const apiKey = '9d52832445de4d18b0c152812240202';

// DOM elements for user input, weather information, and error handling
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const errorPopup = document.getElementById('popup');
const fadePopup = document.getElementById('fade');
// Get references to the DOM elements with IDs 'sun' and 'moon'
const sun = document.getElementById('sun');
const moon = document.getElementById('moon');

// Variable to keep track of the currently focused suggestion
let focusedSuggestionIndex = -1;

// Importing data from external files
import palettes from "../data/weathers.js";
import commonCities from "../data/cities.js";
import {clearSuggestions} from "../data/utils.js";
import {formatString} from "../data/utils.js";

// Function to render weather information on the UI
function renderWeather(data) {
  console.log(data);
 
  // Extracting necessary data from the provided 'data' object
  const location = data.location;
  const currentWeather = data.current;
  const trimTime = data.location.localtime.slice(10);

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
    <h2>${location.name}, ${location.country}</h2>
    <p class="p-sml">${trimTime}</p> 
    <h2>${currentWeather.temp_c}°C / ${currentWeather.temp_f}°F </h2>
    <span class="sml-info">
      <p>Feels like: ${currentWeather.feelslike_c}°C / ${currentWeather.feelslike_f}°F</p>
      <p>Weather: ${currentWeather.condition.text}</p>
      <p>Humidity: ${currentWeather.humidity}%</p>
      <p>Wind: ${currentWeather.wind_kph}kph, ${currentWeather.wind_mph}mph | ${currentWeather.wind_dir}</p>
    </span>
    <img class="weather-img" src="${currentWeather.condition.icon}" alt="Weather Icon">
  `;

  // Setting the generated HTML to the innerHTML of a DOM element with id 'weatherInfo'
  weatherInfo.innerHTML = weatherHTML;

  if(palettes === undefined || palettes.length === 0){
    document.body.style.backgroundImage = `linear-gradient(white, grey)`;
    } else {
   // Iterate through each palette in the 'palettes' array
   for (let i = 0; i < palettes.length; i++) { // (let i = palettes.length; i == 0; i--)
    // Check if it's daytime and the current weather condition matches the day palette
      if (isDay() && (formatString(palettes[i].day) === formatString(currentWeather.condition.text) || formatString(palettes[i].night) === formatString(currentWeather.condition.text))) {
        // Set the background gradient for the body based on the day palette
        document.body.style.backgroundImage = `linear-gradient(white, ${palettes[i].color2})`;
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
  fetchWeatherData(city, 0);
  clearSuggestions();
}

// Function to fetch weather data from the API for a given city
function fetchWeatherData(city) {
  
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=yes&alerts=yes`;
  
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
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      errorPopup.style.display = 'block';
      fadePopup.style.display = 'block';
    });
}

// Event listener for the 'Enter' key to trigger a search
document.getElementById('cityInput').addEventListener('keypress', function(event) {
  if (event.key == 'Enter') {
    searchPress(event);
  }
});

// Event listener for the 'Search' button click to trigger a search
document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('button');
  button.addEventListener('click', getWeather);
  clearSuggestions();
});

// Event listener to hide error popup when clicked
errorPopup.addEventListener('click', function(){
  errorPopup.style.display = 'none';
  fadePopup.style.display = 'none';
  clearSuggestions();
});

// Function to handle 'Enter' key press and trigger a search if input is valid
function searchPress(event){
  if (event.key == "Enter"){
    clearSuggestions();
    getWeather();
    
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
  fetchWeatherData('auto:ip');
}

// Initialize the weather display for Nairobi when the page loads
onLoadWeather();
// INITIAL CALLS

