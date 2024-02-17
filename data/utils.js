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

  export function formatDayWithSuffix(date) {
    
    const day = date.getDate();
    const suffix = (day >= 11 && day <= 13) ? 'th' : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][day % 10];
  
    return day + suffix;
  }
  
  export function airCondition(value) {
    const airColor = document.getElementById('airQuality');   
    if (value < 25) {
      airColor.style.background = `linear-gradient(to right, transparent, green , transparent)`
      return 'Good';
    } else if (value >= 25 && value <= 50) {
      airColor.style.background = `linear-gradient(to right, transparent, yellow , transparent)`
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

 
 
  'linear-gradient(to right, red , yellow)'