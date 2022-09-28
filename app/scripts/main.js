const $hero = document.querySelector(".js-hero");
const $releases = document.querySelector(".js-releases");
const $shows = document.querySelector(".js-shows");
const $body = document.querySelector("body");

const stars = (vote_average) => {
  const score = Math.round(vote_average / 2);
  return Array(score)
    .fill()
    .map(() => '<i class="fa-sharp fa-solid fa-star"></i>')
    .join("");
};

const getGenres = (genresArray, genres) => {
  return genresArray
    .map((genreid) => {
      const genre = genres.find((g) => g.id === genreid);
      return genre.name;
    })
    .join(", ");
};

const renderHero = (movie, genres) => {
  $hero.innerHTML = `
<div class="hero" style="background-image: url('https://image.tmdb.org/t/p/original/${
    movie.backdrop_path
  }')">
  <div class="sidebar">
    <div class="sidebar__logo">
      <img src="./images/logo.png" alt="logo" />
    </div>
    <div class="sidebar__buttons">
      <a href="#"><i class="fa-solid fa-house sidebar__icon"></i></a>
      <a href="#"><i class="fa-solid fa-film sidebar__icon"></i></a>
      <a href="#"><i class="fa-solid fa-tv sidebar__icon"></i></a>
      <a href="#"><i class="fa-regular fa-star sidebar__icon"></i></a>
    </div>
  </div>
  <div class="featured">
    <div class="featured__genre"><p>${getGenres(
      movie.genre_ids,
      genres
    )}</p></div>
    <div class="featured__stars"> ${stars(movie.vote_average)}
    </div>
    <div class="featured__title"><p>${movie.original_title}</p></div>
    <div class="featured__synopsis">
      <p>
      ${movie.overview}
      </p>
    </div>
    <button class="featured__button">Watch now</button>
  </div>
  <div class="menu">
    <a href="#"><i class="fa-regular fa-user menu__icon"></i></a>
    <a href="#"><i class="fa-solid fa-gears menu__icon"></i></a>
  </div>
</div>`;
};

const renderReleases = (movies, genres) => {
  $releases.innerHTML = `
    <div class="releases">
      <div class="releases__title">
        <p>New releases</p>
      </div>
      <div class="movies">
        ${movies
          .slice(1, 6)
          .map(
            (movie) =>
              `<div class="movies__card js-card" data-card-id="${movie.id}">
              <img src="https://image.tmdb.org/t/p/original/${
                movie.poster_path
              }"/>
              <div class="movies__description">
                <div class="movies__genre"><p>${getGenres(
                  movie.genre_ids,
                  genres
                )}</p></div>
                <div class="movies__stars">
                ${stars(movie.vote_average)}
                </div>
                <div class="movies__titles"><p>${movie.original_title}</p></div>
              </div>
              </div>
                <div class="popup" data-popup-id="${movie.id}">
                <div class="popup__content">
                <div class="popup__imagecontainer">
                  <div class="popup__image"><img src="https://image.tmdb.org/t/p/original/${
                    movie.backdrop_path
                  }"></div>
                </div>
              <div class="popup__info">
                <div class="popup__genre"><p>${getGenres(
                  movie.genre_ids,
                  genres
                )}</p></div>
                <div class="popup__score"><p>Rating: ${
                  movie.vote_average
                }/10 (${movie.vote_count} votes)</p></div>
                <div class="popup__title"><p>${movie.original_title}</p></div>
                <div class="popup__overview"><p>${movie.overview}</p></div>
                <div class="popup__date"><p>Release date: ${
                  movie.release_date
                }</p></div>
                </div>
                </div>
                <div class="popup__close js-close">X</div>
              </div>
               `
          )
          .join("")}
      </div>
    </div>
  `;
};

const renderShows = (shows, genres) => {
  $shows.innerHTML = `
  <div class="tvshows">
    <div class="tvshows__title">
      <p>Featured tv shows</p>
    </div>
    <div class="shows">
      ${shows.results
        .slice(0, 3)
        .map(
          (show) =>
            `
          <div class="shows__image">
            <img src="https://image.tmdb.org/t/p/original/${
              show.poster_path
            }" />
            <div class="shows__description">
              <div class="shows__genre"><p>${getGenres(
                show.genre_ids,
                genres
              )}</p></div>
              <div class="shows__stars">
              ${stars(show.vote_average)}
              </div>
              <div class="shows__titles"><p>${show.name}</p></div>
            </div>
            </div>
        `
        )
        .join("")}
    </div>
  </div>
`;
};

const fetchData = async () => {
  const [
    moviesResponse,
    showsResponse,
    movieGenresResponse,
    showGenresResponse,
  ] = await Promise.all([
    fetch(
      "https://api.themoviedb.org/3/movie/popular?api_key=92515dacb4ca084bb3f638e2bc6c77b9"
    ),
    fetch(
      "https://api.themoviedb.org/3/tv/popular?api_key=92515dacb4ca084bb3f638e2bc6c77b9"
    ),
    fetch(
      "https://api.themoviedb.org/3/genre/movie/list?api_key=92515dacb4ca084bb3f638e2bc6c77b9"
    ),
    fetch(
      "https://api.themoviedb.org/3/genre/tv/list?api_key=92515dacb4ca084bb3f638e2bc6c77b9"
    ),
  ]);

  const movies = await moviesResponse.json();
  const shows = await showsResponse.json();
  const movieGenres = await movieGenresResponse.json();
  const showGenres = await showGenresResponse.json();

  return { movies, shows, movieGenres, showGenres };
};

const renderMovies = (movies, genres) => {
  renderHero(movies.results[0], genres);
  renderReleases(movies.results, genres);
};

const renderApp = async () => {
  const { movies, shows, movieGenres, showGenres } = await fetchData();
  renderMovies(movies, movieGenres.genres);
  renderShows(shows, showGenres.genres);

  const $cards = document.querySelectorAll(".js-card");

  $cards.forEach(($card) => {
    const cardId = $card.getAttribute("data-card-id");
    const $popup = document.querySelector(`[data-popup-id="${cardId}"]`);
    const $close = $popup.querySelector(".js-close");

    $card.addEventListener("click", () => {
      $popup.style.visibility = "visible";
      $body.style.overflow = "hidden";
    });

    $close.addEventListener("click", () => {
      $popup.style.visibility = "hidden";
      $body.style.overflow = "auto";
    });
  });
};

renderApp();
