const API_KEY = '3ff1173f'; // Replace with your real OMDB key
const API_URL = 'http://www.omdbapi.com/';

const SUGGESTIONS = [
  'Inception', 'The Godfather', 'Interstellar',
  'The Dark Knight', 'Titanic', 'Parasite'
];

// ── Fetch ──────────────────────────────────────────────────────────────────────

/**
 * Fetch movie data from OMDB API.
 * @param {string} title - The movie title to search.
 * @returns {Promise<Object>} Movie data object.
 * @throws {Error} On network failure or movie not found.
 */
async function fetchMovie(title) {
  const url = API_URL + '?t=' + encodeURIComponent(title) + '&apikey=' + API_KEY + '&plot=full';
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network error (' + response.status + '). Please try again.');
  }

  const data = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || '"' + title + '" was not found. Try another title.');
  }

  return data;
}

// ── Display ────────────────────────────────────────────────────────────────────

/**
 * Render all movie data into the DOM.
 * Uses #movieResult div — matches test expectations.
 * @param {Object} data - Parsed OMDB API response.
 */
function displayMovie(data) {
  const resultDiv = document.getElementById('movieResult');
  const errorDiv  = document.getElementById('errorMessage');

  // Hide and clear error on successful display
  if (errorDiv) {
    errorDiv.textContent   = '';
    errorDiv.style.display = 'none';
  }

  if (!resultDiv) return;

  // Build full movie display with all data
  resultDiv.innerHTML =
    '<div class="movie-card">' +
      '<div class="poster-col">' +
        (data.Poster && data.Poster !== 'N/A'
          ? '<img src="' + data.Poster + '" alt="' + data.Title + ' poster" class="movie-poster" />'
          : '<div class="poster-placeholder">🎬</div>'
        ) +
      '</div>' +
      '<div class="details-col">' +
        '<h2 class="movie-title">' + (data.Title || '') + ' <span class="movie-year">(' + (data.Year || '') + ')</span></h2>' +
        '<div class="movie-badges">' +
          (data.Genre && data.Genre !== 'N/A'
            ? data.Genre.split(',').map(function(g) {
                return '<span class="badge badge-genre">' + g.trim() + '</span>';
              }).join('')
            : '') +
          (data.Rated && data.Rated !== 'N/A'
            ? '<span class="badge badge-rated">' + data.Rated + '</span>'
            : '') +
        '</div>' +
        '<div class="movie-meta">' +
          (data.Director && data.Director !== 'N/A'
            ? '<p><strong>Director:</strong> ' + data.Director + '</p>'
            : '') +
          (data.Actors && data.Actors !== 'N/A'
            ? '<p><strong>Cast:</strong> ' + data.Actors + '</p>'
            : '') +
          (data.Runtime && data.Runtime !== 'N/A'
            ? '<p><strong>Runtime:</strong> ' + data.Runtime + '</p>'
            : '') +
          (data.Released && data.Released !== 'N/A'
            ? '<p><strong>Released:</strong> ' + data.Released + '</p>'
            : '') +
          (data.Language && data.Language !== 'N/A'
            ? '<p><strong>Language:</strong> ' + data.Language + '</p>'
            : '') +
        '</div>' +
        '<div class="movie-plot">' +
          '<strong>Plot:</strong> ' + (data.Plot && data.Plot !== 'N/A' ? data.Plot : 'N/A') +
        '</div>' +
        '<div class="movie-ratings">' +
          (data.imdbRating && data.imdbRating !== 'N/A'
            ? '<span class="badge badge-imdb">⭐ IMDB: ' + data.imdbRating + '</span>'
            : '') +
          (Array.isArray(data.Ratings)
            ? data.Ratings.filter(function(r) {
                return r.Source !== 'Internet Movie Database';
              }).map(function(r) {
                var cls = r.Source.includes('Rotten') ? 'badge-rt' : 'badge-meta';
                return '<span class="badge ' + cls + '">' +
                  r.Source.replace('Rotten Tomatoes', 'RT').replace('Metacritic', 'Meta') +
                  ': ' + r.Value + '</span>';
              }).join('')
            : '') +
        '</div>' +
        (data.Awards && data.Awards !== 'N/A'
          ? '<div class="movie-awards"><strong>Awards:</strong> ' + data.Awards + '</div>'
          : '') +
        (data.BoxOffice && data.BoxOffice !== 'N/A'
          ? '<div class="movie-boxoffice"><strong>Box Office:</strong> ' + data.BoxOffice + '</div>'
          : '') +
      '</div>' +
    '</div>';
}

// ── Error ──────────────────────────────────────────────────────────────────────

/**
 * Display an error message to the user.
 * Uses #errorMessage div — matches test expectations.
 * @param {string} message
 */
function displayError(message) {
  const resultDiv = document.getElementById('movieResult');
  const errorDiv  = document.getElementById('errorMessage');

  // Clear movie result
  if (resultDiv) resultDiv.innerHTML = '';

  // Show error
  if (errorDiv) {
    errorDiv.textContent   = message;
    errorDiv.style.display = 'block';
  }
}

// ── Core Search Flow ───────────────────────────────────────────────────────────

/**
 * Validate input, fetch movie, and display results.
 * @param {string} title - Raw movie title from user.
 */
async function handleSearch(title) {
  const trimmed = (title || '').trim();

  // ── Input validation (edge cases) ──
  if (!trimmed) {
    displayError('Please enter a movie title.');
    return;
  }

  if (trimmed.length < 2) {
    displayError('Please enter at least 2 characters.');
    return;
  }

  if (/^\d+$/.test(trimmed)) {
    displayError('Please enter a movie title, not just numbers.');
    return;
  }

  // Show loading state
  const resultDiv = document.getElementById('movieResult');
  const errorDiv  = document.getElementById('errorMessage');
  if (resultDiv) resultDiv.innerHTML = '<p class="loading-text">Loading...</p>';
  if (errorDiv) {
    errorDiv.textContent   = '';
    errorDiv.style.display = 'none';
  }

  try {
    const data = await fetchMovie(trimmed);
    displayMovie(data);
  } catch (err) {
    console.error('Movie search error:', err);
    displayError(err.message || 'An unexpected error occurred. Please try again.');
  }

  // Clear input after every search
  const input = document.getElementById('movieInput');
  if (input) input.value = '';
}

// ── Event Binding ──────────────────────────────────────────────────────────────

/**
 * Bind all DOM event listeners.
 * Wrapped in DOMContentLoaded so Jest can load file without crashing.
 */
function bindEvents() {
  const searchForm     = document.getElementById('searchForm');
  const movieInput     = document.getElementById('movieInput');
  const suggestionsRow = document.getElementById('suggestions-row');

  // Form submit
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const title = movieInput ? movieInput.value : '';
      handleSearch(title);
    });
  }

  // Suggestion chips
  if (suggestionsRow) {
    SUGGESTIONS.forEach(function(title) {
      const chip = document.createElement('button');
      chip.className = 'suggestion-chip';
      chip.textContent = title;
      chip.setAttribute('type', 'button');
      chip.setAttribute('aria-label', 'Search for ' + title);
      chip.addEventListener('click', function() {
        if (movieInput) movieInput.value = title;
        handleSearch(title);
      });
      suggestionsRow.appendChild(chip);
    });
  }

  // Keyboard shortcut: press "/" to focus search
  document.addEventListener('keydown', function(e) {
    if (e.key === '/' && document.activeElement !== movieInput) {
      e.preventDefault();
      if (movieInput) movieInput.focus();
    }
  });
}

// ── Auto Init (Browser only) ───────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', bindEvents);
}

// ── Exports for Jest ───────────────────────────────────────────────────────────
if (typeof module !== 'undefined') {
  module.exports = { fetchMovie, displayMovie, displayError, handleSearch, bindEvents };
}