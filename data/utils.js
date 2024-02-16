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

