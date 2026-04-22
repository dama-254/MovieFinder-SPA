# 🎬 Movie Finder SPA

A Single Page Application that allows users to search for any movie and instantly view detailed information — all without the page reloading.

---

## 📖 Description

Movie Finder SPA is a lightweight, browser-based application built with vanilla HTML, CSS, and JavaScript. It connects to the [OMDB API](https://www.omdbapi.com/) to fetch real-time movie data including posters, plot summaries, ratings, and more. The app is designed with simplicity and usability in mind — one page, zero reloads.

---

## 🚀 Features

- 🔍 Search any movie by title
- 🎭 Displays movie poster, title, year, genre, director, plot, and IMDB rating
- ⚠️ User-friendly error messages for invalid or empty searches
- 🧹 Auto-clears the input field after each search
- 📱 Responsive and clean dark-themed UI

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure and markup |
| CSS3 | Styling and layout |
| JavaScript (ES6+) | DOM manipulation and API calls |
| OMDB API | Movie data source |
| Jest | Unit testing |
| Node.js | JavaScript runtime environment |

---

## ⚙️ Setup and Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine
- A free OMDB API key from [omdbapi.com](https://www.omdbapi.com/apikey.aspx)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/movie-finder-spa.git
   ```

2. **Navigate into the project folder**
   ```bash
   cd movie-finder-spa
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Add your API key**

   Open `script.js` and replace the placeholder on line 1:
   ```javascript
   const API_KEY = 'your_actual_api_key_here';
   ```

5. **Open the app in your browser**
   ```bash
   open index.html
   ```
   Or simply drag the `index.html` file into your browser.

---

## 🧪 Running Tests

This project uses [Jest](https://jestjs.io/) for unit testing.

```bash
npm test
```

### Test Coverage

| Test | Description |
|------|-------------|
| `displayMovie` | Verifies movie title, year, genre, and director render correctly |
| `displayError` | Confirms error messages appear and movie result is cleared |
| `handleSearch` | Tests empty input, whitespace input, API calls, and input clearing |

---

## 📁 Project Structure

```
movie-finder-spa/
├── index.html          # Main HTML page
├── script.js           # Core JavaScript logic
├── styles.css          # Styling
├── package.json        # Project configuration and scripts
└── test/
    └── script.test.js  # Jest unit tests
```

---

## 🔑 Getting an OMDB API Key

1. Go to [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
2. Select the **FREE** plan
3. Enter your email address and submit
4. Check your inbox and click the **activation link**
5. Copy the 8-character key and paste it into `script.js`

---

## 💡 How It Works

1. User types a movie title into the search bar and clicks **Search**
2. JavaScript intercepts the form submission with `preventDefault()` to stop page reload
3. The `handleSearch()` function validates the input
4. If valid, `fetchMovie()` sends a GET request to the OMDB API
5. The JSON response is parsed and passed to `displayMovie()` which updates the DOM
6. If an error occurs, `displayError()` shows a message to the user

---

## 🖼️ Example Search Results

Try searching for any of these movies:

- `Inception`
- `The Dark Knight`
- `Interstellar`
- `The Godfather`
- `Titanic`

To test error handling, search for `xyzxyzxyz` — you should see a **"Movie not found"** message.

---

## 🐛 Known Issues

- The OMDB free plan is limited to **1,000 requests per day**
- Some older or less popular movies may not have a poster image available
- The app searches by exact title — partial matches may not always return the expected result

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👩‍💻 Author

Built by **Damaris** as part of a web development course project.

---

> Data provided by the [OMDB API](https://www.omdbapi.com/) — The Open Movie Database.