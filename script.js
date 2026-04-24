
const API_KEY  = '3ff1173f'; 
const API_URL  = 'https://www.omdbapi.com/';

const SUGGESTIONS = [
  'Inception', 'The Godfather', 'Interstellar',
  'The Dark Knight', 'Titanic', 'Parasite'
];


/**
 * Fetch movie data from the OMDB API.
 * @param {string} title - Movie title to search.
 * @returns {Promise<Object>} Parsed movie data object.
 * @throws {Error} On network failure or movie not found.
 */
async function fetchMovie(title) {
  var url = API_URL + '?t=' + encodeURIComponent(title) + '&apikey=' + API_KEY + '&plot=full';
  var response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network error (' + response.status + '). Please try again.');
  }

  var data = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error || '"' + title + '" was not found. Try another title.');
  }

  return data;
}

// ── Display ───────────────────────────────────────────────────

/**
 * Render all movie data dynamically into the DOM.
 * Writes to #movieResult — matches test expectations.
 * @param {Object} data - OMDB API response object.
 */
function displayMovie(data) {
  var resultDiv = document.getElementById('movieResult');
  var errorDiv  = document.getElementById('errorMessage');
  var welcome   = document.getElementById('welcome');
  var loading   = document.getElementById('loading');

  if (loading)  loading.hidden      = true;
  if (welcome)  welcome.hidden      = true;
  if (errorDiv) {
    errorDiv.textContent   = '';
    errorDiv.style.display = 'none';
  }
  if (!resultDiv) return;

  // ── Build poster ──
  var posterHTML = data.Poster && data.Poster !== 'N/A'
    ? '<img src="' + data.Poster + '" alt="' + data.Title + ' movie poster" class="movie-poster" />'
    : '<div class="poster-placeholder">🎬</div>';

  // ── Build genre badges ──
  var genreBadges = '';
  if (data.Genre && data.Genre !== 'N/A') {
    data.Genre.split(',').forEach(function(g) {
      genreBadges += '<span class="badge badge-genre">' + g.trim() + '</span>';
    });
  }
  if (data.Rated && data.Rated !== 'N/A') {
    genreBadges += '<span class="badge badge-rated">' + data.Rated + '</span>';
  }

  // ── Build ratings badges ──
  var ratingBadges = '';
  if (data.imdbRating && data.imdbRating !== 'N/A') {
    ratingBadges += '<span class="badge badge-imdb">⭐ IMDB: ' + data.imdbRating + '/10</span>';
  }
  if (Array.isArray(data.Ratings)) {
    data.Ratings.forEach(function(r) {
      if (r.Source.includes('Rotten')) {
        ratingBadges += '<span class="badge badge-rt">🍅 RT: ' + r.Value + '</span>';
      }
      if (r.Source.includes('Metacritic')) {
        ratingBadges += '<span class="badge badge-meta">🎯 Meta: ' + r.Value + '</span>';
      }
    });
  }

  // ── Build meta items ──
  var metaItems = '';
  var metaFields = [
    { label: 'Director',  value: data.Director },
    { label: 'Cast',      value: data.Actors },
    { label: 'Runtime',   value: data.Runtime },
    { label: 'Released',  value: data.Released },
    { label: 'Language',  value: data.Language },
    { label: 'Country',   value: data.Country }
  ];
  metaFields.forEach(function(f) {
    if (f.value && f.value !== 'N/A') {
      metaItems +=
        '<div class="meta-item">' +
          '<span class="meta-label">' + f.label + '</span>' +
          '<span class="meta-value">' + f.value + '</span>' +
        '</div>';
    }
  });

  // ── Build extra info blocks ──
  var extraBlocks = '';
  var extraFields = [
    { label: 'Awards',     value: data.Awards },
    { label: 'Box Office', value: data.BoxOffice },
    { label: 'Writer',     value: data.Writer },
    { label: 'Production', value: data.Production }
  ];
  extraFields.forEach(function(f) {
    if (f.value && f.value !== 'N/A') {
      extraBlocks +=
        '<div class="info-block">' +
          '<div class="meta-label">' + f.label + '</div>' +
          '<div class="meta-value" style="margin-top:0.3rem">' + f.value + '</div>' +
        '</div>';
    }
  });

  
  resultDiv.innerHTML =
    '<div class="movie-card">' +
      '<div class="poster-wrap">' + posterHTML + '</div>' +
      '<div class="movie-info">' +
        '<div class="title-row">' +
          '<h2 class="movie-title">' + (data.Title || '') + '</h2>' +
          '<span class="movie-year">(' + (data.Year || '') + ')</span>' +
        '</div>' +
        '<div class="badges-row">' + genreBadges + '</div>' +
        '<div class="meta-grid">' + metaItems + '</div>' +
        '<div class="plot-block">' +
          '<span class="meta-label">Plot</span>' +
          '<p class="movie-plot">' + (data.Plot && data.Plot !== 'N/A' ? data.Plot : 'No plot available.') + '</p>' +
        '</div>' +
        '<div class="ratings-row">' + ratingBadges + '</div>' +
      '</div>' +
    '</div>' +
    (extraBlocks ? '<div class="extra-row">' + extraBlocks + '</div>' : '');
}

// ── Error ─────────────────────────────────────────────────────

/**
 * Display a user-friendly error message.
 * Writes to #errorMessage — matches test expectations.
 * Clears #movieResult content.
 * @param {string} message
 */
function displayError(message) {
  var resultDiv = document.getElementById('movieResult');
  var errorDiv  = document.getElementById('errorMessage');
  var loading   = document.getElementById('loading');

  if (loading)  loading.hidden = true;
  if (resultDiv) resultDiv.innerHTML = '';
  if (errorDiv) {
    errorDiv.textContent   = message;
    errorDiv.style.display = 'block';
  }
}

// ── Search Flow ───────────────────────────────────────────────

/**
 * Validate input, fetch movie, and orchestrate the display.
 * Handles all edge cases before making any API call.
 * @param {string} title - Raw movie title from the user.
 */
async function handleSearch(title) {
  var trimmed = (title || '').trim();

  // ── Input validation edge cases ──
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

  // ── Show loading state ──
  var loading   = document.getElementById('loading');
  var errorDiv  = document.getElementById('errorMessage');
  var resultDiv = document.getElementById('movieResult');
  var welcome   = document.getElementById('welcome');

  if (welcome)   welcome.hidden      = true;
  if (loading)   loading.hidden      = false;
  if (resultDiv) resultDiv.innerHTML = '';
  if (errorDiv) {
    errorDiv.textContent   = '';
    errorDiv.style.display = 'none';
  }

  try {
    var data = await fetchMovie(trimmed);
    displayMovie(data);
  } catch (err) {
    console.error('Movie search error:', err);
    displayError(err.message || 'An unexpected error occurred. Please try again.');
  }

  // ── Clear input after every search ──
  var input = document.getElementById('movieInput');
  if (input) input.value = '';
}

// ── Event Binding ─────────────────────────────────────────────

/**
 * Bind all DOM event listeners.
 * Separated into its own function so Jest can control when it fires.
 * Called only on DOMContentLoaded in the browser.
 */
function bindEvents() {
  var form          = document.getElementById('searchForm');
  var input         = document.getElementById('movieInput');
  var suggestRow    = document.getElementById('suggestions-row');
  var welcome       = document.getElementById('welcome');

  // Form submit
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var title = input ? input.value : '';
      handleSearch(title);
    });
  }

  // Suggestion chips
  if (suggestRow) {
    SUGGESTIONS.forEach(function(title) {
      var chip = document.createElement('button');
      chip.className   = 'suggestion-chip';
      chip.textContent = title;
      chip.setAttribute('type', 'button');
      chip.setAttribute('aria-label', 'Search for ' + title);
      chip.addEventListener('click', function() {
        if (input) input.value = title;
        handleSearch(title);
      });
      suggestRow.appendChild(chip);
    });
  }

  // Keyboard shortcut: press "/" to focus search
  document.addEventListener('keydown', function(e) {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      if (input) input.focus();
    }
  });

  // Show welcome state on load
  if (welcome) welcome.hidden = false;
}

// ── Auto Init (browser only) ──────────────────────────────────
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', bindEvents);
}

// ── Exports for Jest ──────────────────────────────────────────
if (typeof module !== 'undefined') {
  module.exports = { fetchMovie, displayMovie, displayError, handleSearch, bindEvents };
}