// UTILITIES AND HELPER FUNCTIONS 
// Function to clear suggestions
export function clearSuggestions() {
    document.getElementById('cityInput').value = '';
    document.getElementById('cityOutput').innerHTML = '';
    document.getElementById('cityOutput').classList.remove('show');
    cityInput.style.border = '';
    //focusedSuggestionIndex = -1;
  }
  
  // Function to format strings
  export function formatString(input){
    return input.toLowerCase().trim();
  }
  // UTILITIES AND HELPER FUNCTIONS

  // Function to add letters to date
  export function formatDayWithSuffix(date) {
    
    const day = date.getDate();
    const suffix = (day >= 11 && day <= 13) ? 'th' : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][day % 10];
  
    return day + suffix;
  }
  
  // Function to check air quality
  export function airCondition(value) {
    const airColor = document.getElementById('airQuality');   
    if (value < 25) {
      airColor.style.background = `linear-gradient(to right, transparent, green , transparent)`
      return 'Good';
    } else if (value >= 25 && value <= 50) {
      airColor.style.background = `linear-gradient(to right, transparent, rgba(238, 238, 43, 0.726) , transparent)`
      return 'Fair';
    } else if (value > 50 && value <= 100) {
      airColor.style.background = `linear-gradient(to right, transparent, orange , transparent)`
      return 'Poor';
    } else if (value > 100 && value <= 300) {
      airColor.style.background = `linear-gradient(to right, transparent, red , transparent)`
      return 'Very Poor';
    } else {
      airColor.style.background = `linear-gradient(to right, transparent, purple , transparent)`
      return 'Extremely Poor';
    }
  }

  // Function to check uv quality
  export function uvCondition(value) {
    const uvColor = document.getElementById('uvQuality');   
    if (value <= 2) {
      uvColor.style.background = `linear-gradient(to right, transparent, green , transparent)`
      return `${value} <small>(Low)</small>`;
    } else if (value >= 3 && value <= 5) {
      uvColor.style.background = `linear-gradient(to right, transparent, rgba(238, 238, 43, 0.726) , transparent)`
      return `${value} <small>(Moderate)</small>`;
    } else if (value > 6 && value <= 7) {
      uvColor.style.background = `linear-gradient(to right, transparent, orange , transparent)`
      return `${value} <small>(High)</small>`;
    } else if (value > 8 && value <= 10) {
      uvColor.style.background = `linear-gradient(to right, transparent, red , transparent)`
      return `${value} <small>(Very High)</small>`;
    } else {
      uvColor.style.background = `linear-gradient(to right, transparent, purple , transparent)`
      return `${value} <small>(Extreme)</small>`;
    }
  }

  // Function to truncate text
  export function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    } else {
        return text.slice(0, maxLength) + '...';
    }
}
 