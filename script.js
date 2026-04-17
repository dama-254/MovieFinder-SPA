const API_KEY = '3ff1173f';

async function fetchMovie(title) {
  const res = await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`);
  
  if (!res.ok) {
    throw new Error('Network error. Please try again.');
  }

  const data = await res.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || 'Movie not found.');
  }

  return data;
}

function displayMovie(data) {
  const resultDiv = document.getElementById('movieResult');
  const errorDiv = document.getElementById('errorMessage');

  if (errorDiv) {
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
  }

  const trailerQuery = encodeURIComponent(data.Title + " official trailer");
  const youtubeUrl = `https://www.youtube.com/results?search_query=${trailerQuery}`;

  resultDiv.innerHTML =
    '<h2>' + data.Title + ' (' + data.Year + ')</h2>' +
    '<img src="' + (data.Poster !== 'N/A' ? data.Poster : '') + '" alt="' + data.Title + ' Poster" />' +
    '<p><strong>Genre:</strong> ' + data.Genre + '</p>' +
    '<p><strong>Director:</strong> ' + data.Director + '</p>' +
    '<p><strong>Plot:</strong> ' + data.Plot + '</p>' +
    '<p><strong>IMDB Rating:</strong> ' + data.imdbRating + '</p>' +
    '<a href="' + youtubeUrl + '" target="_blank" class="play-btn">▶ Watch Trailer on YouTube</a>';
}

function displayError(message) {
  const resultDiv = document.getElementById('movieResult');
  const errorDiv = document.getElementById('errorMessage');
  resultDiv.innerHTML = '';
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  } else {
    resultDiv.innerHTML = '<p>' + message + '</p>';
  }
}

async function handleSearch(title) {
  const resultDiv = document.getElementById('movieResult');
  const input = document.getElementById('movieInput');
  if (!title || title.trim() === '') {
    displayError('Please enter a movie title.');
    return;
  }
  resultDiv.innerHTML = '<p>Loading...</p>';
  try {
    const data = await fetchMovie(title.trim());
    displayMovie(data);
  } catch (err) {
    displayError(err.message);
  }
  if (input) input.value = '';
}

function bindEvents() {
  const form = document.getElementById('searchForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = document.getElementById('movieInput');
      const title = input ? input.value : '';
      handleSearch(title);
    });
  }
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', bindEvents);
}

if (typeof module !== 'undefined') {
  module.exports = { fetchMovie, displayMovie, displayError, handleSearch, bindEvents };
}