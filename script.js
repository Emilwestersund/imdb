const apiKey = "32ee2a3c";

const searchPhrases = ["action movie", "comedy film", "drama movie", "sci-fi film", "romantic movie", "thriller film"];

document.addEventListener("DOMContentLoaded", getRandomRecommendedMovies);

async function searchMovie() {
    const movieTitle = document.getElementById("movie-input").value;
    if (!movieTitle) return;

    try {
        const response = await fetch(`https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}&plot=full`);
        const movie = await response.json();

        console.log("Search Response:", movie);

        if (movie.Response === "False") {
            document.getElementById("movie-search-info").innerHTML = `Ingen film funnet.`;
            return;
        }

        document.getElementById("movie-search-info").innerHTML = `
            <div class="movie-card">
                ${movie.Poster !== "N/A" ? `<img src="${movie.Poster}" alt="${movie.Title}">` : '<p>Missing photo</p>'}
                <h3>${movie.Title} (${movie.Year})</h3>
                <p><strong>Regissør:</strong> ${movie.Director}</p>
                <p><strong>Sjanger:</strong> ${movie.Genre}</p>
                <p><strong>Handling:</strong> ${movie.Plot}</p>
            </div>
        `;

        getRecommendedMovies(movie.Genre, movieTitle);
    } catch (error) {
        console.error("Feil ved henting av data:", error);
        document.getElementById("movie-search-info").innerHTML = "En feil oppstod ved henting av data.";
    }
}

async function getRecommendedMovies(genre = "", originalSearch = "") {
    try {
        const movieQuery = genre || getRandomQuery();
        console.log("Using Query:", movieQuery);
        const response = await fetch(`https://www.omdbapi.com/?s=${originalSearch || movieQuery}&apikey=${apiKey}`);
        const movies = await response.json();

        console.log("Recommended Movies Response:", movies);

        if (movies.Response === "False") {
            document.getElementById("recommended-movies").innerHTML = "Ingen film funnet.";
            return;
        }

        const filteredMovies = movies.Search.filter(movie => movie.Title.toLowerCase() !== originalSearch.toLowerCase());

        const recommendedMovies = filteredMovies.slice(0, 3).map(movie => `
            <div class="movie-card">
                ${movie.Poster !== "N/A" ? `<img src="${movie.Poster}" alt="${movie.Title}">` : '<p>Missing photo</p>'}
                <h3>${movie.Title} (${movie.Year})</h3>
            </div>
        `).join("");

        document.getElementById("recommended-movies").innerHTML = recommendedMovies;
    } catch (error) {
        console.error("Feil ved henting av data:", error);
        document.getElementById("recommended-movies").innerHTML = "En feil oppstod ved henting av data.";
    }
}

async function getRandomRecommendedMovies() {
    try {
        const randomQuery = getRandomQuery();
        console.log("Using Random Query:", randomQuery);
        const response = await fetch(`https://www.omdbapi.com/?s=${randomQuery}&apikey=${apiKey}`);
        const movies = await response.json();

        console.log("Random Recommended Movies Response:", movies);

        if (movies.Response === "False") {
            document.getElementById("recommended-movies").innerHTML = "Ingen film funnet.";
            return;
        }

        const randomMovies = movies.Search.slice(0, 3);
        console.log("Random Movies:", randomMovies);

        const recommendedMoviesHTML = randomMovies.map(movie => `
            <div class="movie-card">
                ${movie.Poster !== "N/A" ? `<img src="${movie.Poster}" alt="${movie.Title}">` : '<p>Missing photo</p>'}
                <h3>${movie.Title} (${movie.Year})</h3>
            </div>
        `).join("");

        document.getElementById("recommended-movies").innerHTML = recommendedMoviesHTML;
    } catch (error) {
        console.error("Feil ved henting av data:", error);
        document.getElementById("recommended-movies").innerHTML = "En feil oppstod ved henting av data.";
    }
}

function getRandomQuery() {
    const searchPhrases = ["action movie", "comedy film", "drama movie", "sci-fi film", "romantic movie", "thriller film"];
    const randomPhrase = searchPhrases[Math.floor(Math.random() * searchPhrases.length)];
    console.log("Generated Random Query:", randomPhrase);
    return randomPhrase;
}
