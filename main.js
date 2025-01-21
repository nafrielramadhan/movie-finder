// make the input size fit with the place holder text (src: stackoverflow)
var input = document.querySelectorAll("input");
for (i = 0; i < input.length; i++) {
  input[i].setAttribute("size", input[i].getAttribute("placeholder").length);
}

const movieSearchBox = document.getElementById("movie-search-box"); //html line 33
const searchList = document.getElementById("search-list"); // html line 44
const resultGrid = document.getElementById("result-grid"); //html line 62

async function getMovies(searchTerm) {
  try {
    const URL = `http://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=a9bbb7a9`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if (data.Response == "True") displayMovieList(data.Search);
  } catch (error) {
    console.log("Error fetch data getMovies");
    console.log(error);
  }
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    getMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");
    // console.log(movieListItem);
    movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
    movieListItem.classList.add("search-list-item");
    if (movies[idx].Poster != "N/A") moviePoster = movies[idx].Poster;
    else moviePoster = "./assets/no-poster.svg";

    movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      try {
        const result = await fetch(
          `http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=a9bbb7a9`
        );
        const movieDetails = await result.json();
        displayMovieDetails(movieDetails);
      } catch (error) {
        console.log("Error fecth data loadMovieDetails");
        console.log(error);
      }
    });
  });
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
    <div class="movie-poster">
        <img src="${
          details.Poster != "N/A" ? details.Poster : "./assets/no-poster.svg"
        }" alt="Movie Poster">
    </div>

    <div class="movie-info">
        <h3 class="movie-title"> ${details.Title}</h3>
        <ul class="movie-general-info">
        <li class="year"><b>Year:</b> ${details.Year}</li>
        <li class="rated"><b>Ratings:</b> ${details.Rated}</li>
        <li class="released"><b>Released:</b> ${details.Released}</li>
        </ul>

        <p class="genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="writer"><b>Writer:</b> ${details.Writer}</p>
        <p class="actor"><b>Actors:</b> ${details.Actors}</p>
        <p class="plot"><b>Plot:</b> ${details.Plot}
        </p>
    </div>`;
}

window.addEventListener("click", (event) => {
  if (event.target.className != "search") {
    searchList.classList.add("hide-search-list");
  }
});
