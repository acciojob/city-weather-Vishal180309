// Import required libraries
import axios from 'axios';

// Get API key from OpenWeatherMap
const API_KEY = 'YOUR_API_KEY_HERE';

// Function to get weather data from OpenWeatherMap API
async function getWeatherData(query) {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Function to display weather data
function displayWeatherData(data) {
  const weatherIcon = data.weather[0].icon;
  const temperature = data.main.temp;
  const weatherDescription = data.weather[0].description;

  const weatherDiv = document.querySelector('.weather');
  const html = `
    <h2>${data.name}</h2>
    <i class="wi wi-owm-${weatherIcon} weather-icon"></i>
    <p>Temperature: ${temperature}°C</p>
    <p>Weather: ${weatherDescription}</p>
  `;

  weatherDiv.innerHTML = html;
}

// Function to handle search input
function handleSearchInput() {
  const searchInput = document.querySelector('.search');
  const query = searchInput.value.trim();

  if (query) {
    getWeatherData(query).then(data => displayWeatherData(data));
  } else {
    alert('Please enter a city name!');
  }
}

// Add event listener to search button
document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.querySelector('.search-button');
  searchButton.addEventListener('click', handleSearchInput);
});
