const { displayMovie, displayError, handleSearch } = require('../script.js');

beforeEach(() => {
  document.body.innerHTML = `
    <form id="searchForm">
      <input type="text" id="movieInput" />
      <button type="submit">Search</button>
    </form>
    <div id="movieResult"></div>
    <div id="errorMessage" style="display:none;"></div>
  `;
});

describe('displayMovie', () => {
  test('displays movie title and year', () => {
    const mockData = {
      Title: 'Inception',
      Year: '2010',
      Genre: 'Sci-Fi',
      Director: 'Christopher Nolan',
      Plot: 'A thief who steals corporate secrets.',
      imdbRating: '8.8',
      Poster: 'N/A',
    };
    displayMovie(mockData);
    const result = document.getElementById('movieResult');
    expect(result.innerHTML).toContain('Inception');
    expect(result.innerHTML).toContain('2010');
  });

  test('displays genre and director', () => {
    const mockData = {
      Title: 'Inception',
      Year: '2010',
      Genre: 'Sci-Fi',
      Director: 'Christopher Nolan',
      Plot: 'A thief who steals corporate secrets.',
      imdbRating: '8.8',
      Poster: 'N/A',
    };
    displayMovie(mockData);
    const result = document.getElementById('movieResult');
    expect(result.innerHTML).toContain('Sci-Fi');
    expect(result.innerHTML).toContain('Christopher Nolan');
  });
});

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
    const result = document.getElementById('movieResult');
    expect(result.innerHTML).toBe('');
  });
});

describe('handleSearch', () => {
  test('shows error for empty input', async () => {
    await handleSearch('');
    const errorDiv = document.getElementById('errorMessage');
    expect(errorDiv.textContent).toBe('Please enter a movie title.');
  });

  test('shows error for whitespace-only input', async () => {
    await handleSearch('   ');
    const errorDiv = document.getElementById('errorMessage');
    expect(errorDiv.textContent).toBe('Please enter a movie title.');
  });

  test('calls fetch with the correct URL', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        Response: 'True',
        Title: 'Inception',
        Year: '2010',
        Genre: 'Sci-Fi',
        Director: 'Christopher Nolan',
        Plot: 'A thief.',
        imdbRating: '8.8',
        Poster: 'N/A',
      }),
    });
    await handleSearch('Inception');
    expect(global.fetch).toHaveBeenCalled();
    const calledUrl = global.fetch.mock.calls[0][0];
    expect(calledUrl).toContain('Inception');
  });

  test('displays error when API returns Response False', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        Response: 'False',
        Error: 'Movie not found!',
      }),
    });
    await handleSearch('xyzxyzxyz');
    const errorDiv = document.getElementById('errorMessage');
    expect(errorDiv.style.display).toBe('block');
  });

  test('clears the input field after search', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        Response: 'True',
        Title: 'Inception',
        Year: '2010',
        Genre: 'Sci-Fi',
        Director: 'Christopher Nolan',
        Plot: 'A thief.',
        imdbRating: '8.8',
        Poster: 'N/A',
      }),
    });
    document.getElementById('movieInput').value = 'Inception';
    await handleSearch('Inception');
    expect(document.getElementById('movieInput').value).toBe('');
  });
});
