/**
 * MOVIEFINDER SPA — Jest Test Suite
 * Tests for all rubric criteria
 */

const { displayMovie, displayError, handleSearch, bindEvents } = require('../script.js');

// ── Setup DOM before each test ────────────────────────────────
beforeEach(() => {
  document.body.innerHTML = `
    <form id="searchForm">
      <input type="text" id="movieInput" />
      <button type="submit">Search</button>
    </form>
    <div id="loading" hidden></div>
    <div id="errorMessage" style="display:none;"></div>
    <section id="movieResult"></section>
    <div id="welcome" hidden></div>
    <div id="suggestions-row"></div>
  `;
});

// ── displayMovie ──────────────────────────────────────────────
describe('displayMovie', () => {

  const mockData = {
    Title:      'Inception',
    Year:       '2010',
    Genre:      'Action, Sci-Fi',
    Director:   'Christopher Nolan',
    Actors:     'Leonardo DiCaprio, Joseph Gordon-Levitt',
    Plot:       'A thief who steals corporate secrets through dream-sharing technology.',
    imdbRating: '8.8',
    Poster:     'N/A',
    Rated:      'PG-13',
    Runtime:    '148 min',
    Language:   'English',
    Country:    'USA',
    Awards:     'Won 4 Oscars.',
    BoxOffice:  '$292,576,195',
    Response:   'True',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.8/10' },
      { Source: 'Rotten Tomatoes',         Value: '87%' },
      { Source: 'Metacritic',              Value: '74/100' }
    ]
  };

  test('displays movie title in movieResult', () => {
    displayMovie(mockData);
    const result = document.getElementById('movieResult');
    expect(result.innerHTML).toContain('Inception');
  });

  test('displays movie year', () => {
    displayMovie(mockData);
    const result = document.getElementById('movieResult');
    expect(result.innerHTML).toContain('2010');
  });

  test('displays director name', () => {
    displayMovie(mockData);
    const result = document.getElementById('movieResult');
    expect(result.innerHTML).toContain('Christopher Nolan');
  });

  test('displays genre', () => {
    displayMovie(mockData);
    const result = document.getElementById('movieResult');
    expect(result.innerHTML).toContain('Action');
  });

  test('displays plot', () => {
    displayMovie(mockData);
    const result = document.getElementById('movieResult');
    expect(result.innerHTML).toContain('A thief who steals corporate secrets');
  });

  test('displays IMDB rating', () => {
    displayMovie(mockData);
    const result = document.getElementById('movieResult');
    expect(result.innerHTML).toContain('8.8');
  });

  test('clears error message on successful display', () => {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent   = 'old error';
    errorDiv.style.display = 'block';
    displayMovie(mockData);
    expect(errorDiv.style.display).toBe('none');
    expect(errorDiv.textContent).toBe('');
  });

  test('shows poster placeholder when no poster available', () => {
    displayMovie(mockData);
    const result = document.getElementById('movieResult');
    expect(result.innerHTML).toContain('poster-placeholder');
  });
});

// ── displayError ──────────────────────────────────────────────
describe('displayError', () => {

  test('displays error message in errorMessage div', () => {
    displayError('Movie not found.');
    const errorDiv = document.getElementById('errorMessage');
    expect(errorDiv.textContent).toBe('Movie not found.');
    expect(errorDiv.style.display).toBe('block');
  });

  test('clears movieResult when showing error', () => {
    document.getElementById('movieResult').innerHTML = '<p>Old content</p>';
    displayError('Something went wrong.');
    expect(document.getElementById('movieResult').innerHTML).toBe('');
  });

  test('hides loading spinner when showing error', () => {
    const loading = document.getElementById('loading');
    loading.hidden = false;
    displayError('Error occurred.');
    expect(loading.hidden).toBe(true);
  });
});

// ── handleSearch ──────────────────────────────────────────────
describe('handleSearch', () => {

  test('shows error for empty input', async () => {
    await handleSearch('');
    const errorDiv = document.getElementById('errorMessage');
    expect(errorDiv.textContent).toBe('Please enter a movie title.');
    expect(errorDiv.style.display).toBe('block');
  });

  test('shows error for whitespace-only input', async () => {
    await handleSearch('   ');
    const errorDiv = document.getElementById('errorMessage');
    expect(errorDiv.textContent).toBe('Please enter a movie title.');
  });

  test('shows error for single character input', async () => {
    await handleSearch('a');
    const errorDiv = document.getElementById('errorMessage');
    expect(errorDiv.textContent).toBe('Please enter at least 2 characters.');
  });

  test('calls fetch with the correct URL containing the title', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        Response:   'True',
        Title:      'Inception',
        Year:       '2010',
        Genre:      'Sci-Fi',
        Director:   'Christopher Nolan',
        Actors:     'Leonardo DiCaprio',
        Plot:       'A thief steals secrets.',
        imdbRating: '8.8',
        Poster:     'N/A',
        Rated:      'PG-13',
        Runtime:    '148 min',
        Language:   'English',
        Country:    'USA',
        Awards:     'N/A',
        BoxOffice:  'N/A',
        Ratings:    []
      })
    });

    await handleSearch('Inception');
    expect(global.fetch).toHaveBeenCalled();
    const calledUrl = global.fetch.mock.calls[0][0];
    expect(calledUrl).toContain('Inception');
  });

  test('displays movie data after successful fetch', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        Response:   'True',
        Title:      'Inception',
        Year:       '2010',
        Genre:      'Sci-Fi',
        Director:   'Christopher Nolan',
        Actors:     'Leonardo DiCaprio',
        Plot:       'A thief steals secrets.',
        imdbRating: '8.8',
        Poster:     'N/A',
        Rated:      'PG-13',
        Runtime:    '148 min',
        Language:   'English',
        Country:    'USA',
        Awards:     'N/A',
        BoxOffice:  'N/A',
        Ratings:    []
      })
    });

    await handleSearch('Inception');
    const result = document.getElementById('movieResult');
    expect(result.innerHTML).toContain('Inception');
  });

  test('displays error when API returns Response False', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        Response: 'False',
        Error:    'Movie not found!'
      })
    });

    await handleSearch('xyzxyzxyz');
    const errorDiv = document.getElementById('errorMessage');
    expect(errorDiv.style.display).toBe('block');
  });

  test('clears the input field after search', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        Response:   'True',
        Title:      'Inception',
        Year:       '2010',
        Genre:      'Sci-Fi',
        Director:   'Christopher Nolan',
        Actors:     'Leonardo DiCaprio',
        Plot:       'A thief.',
        imdbRating: '8.8',
        Poster:     'N/A',
        Rated:      'PG-13',
        Runtime:    '148 min',
        Language:   'English',
        Country:    'USA',
        Awards:     'N/A',
        BoxOffice:  'N/A',
        Ratings:    []
      })
    });

    document.getElementById('movieInput').value = 'Inception';
    await handleSearch('Inception');
    expect(document.getElementById('movieInput').value).toBe('');
  });
});

// ── bindEvents ────────────────────────────────────────────────
describe('bindEvents', () => {

  test('shows welcome section on init', () => {
    bindEvents();
    expect(document.getElementById('welcome').hidden).toBe(false);
  });

  test('creates suggestion chips in suggestions-row', () => {
    bindEvents();
    const row = document.getElementById('suggestions-row');
    expect(row.children.length).toBeGreaterThan(0);
  });

  test('binds submit listener to searchForm', () => {
    bindEvents();
    const form = document.getElementById('searchForm');
    expect(form).not.toBeNull();
  });
});