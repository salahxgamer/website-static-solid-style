/**
 * Creates a new movie card and displays it on the page
 * @param  {String} title       Movie Title
 * @param  {String} description Movie Plot/Description
 * @param  {String} rating      Movie Rating, value between 0 and 10
 * @param  {String} posterURL   Movie Poster URL
 * @return {HTMLElement}        HTMLElement of the created movie card
 */
function createMovieCard(title, description, rating, posterURL) {

    /**
     * Modifies the rating of a movie card by changing star styles
     * @param {HTMLElement} movie_rating stars container/parent
     * @param {number} rating       rating value between 0 and 10
     */
    function setRating(movie_rating, rating) {
        stars = movie_rating.getElementsByClassName('icon')
        for (var i = 0; i < stars.length; i++) {
            if (rating / 2 > 0)
                stars[i].style = "--icon : url('../../src/images/movie-card/star.svg')"
            else
                stars[i].style = "--icon : url('../../src/images/movie-card/e-star.svg')"
            rating -= 2;
        }
    }

    // duplicating movie card
    const movies_grid = document.getElementsByClassName('movies-grid')[0];
    const movie_card = document.getElementsByClassName('movie-card')[0].cloneNode(true);
    const movie_title = movie_card.getElementsByClassName('movie-title')[0];
    const movie_description = movie_card.getElementsByClassName('movie-description')[0];
    const movie_rating = movie_card.getElementsByClassName('movie-rating')[0];

    // used to change type depending on the rating
    const star = '../../src/images/movie-card/star.svg'
    const e_star = '../../src/images/movie-card/e-star.svg'

    // modifying movie card informations
    movie_card.style.backgroundImage = `url(${posterURL})`
    movie_title.innerText = title
    movie_description.innerText = description
    setRating(movie_rating, rating)

    return movies_grid.appendChild(movie_card)

}


/**
 * Generates a new movie card for a moview with the id `movie_id`, data is fetched from an api
 * @param  {String} movie_id A valid IMDB Id. ex: 'tt0050083'
 * @return {Undefined}          Doesn't return anything
 */
function generateMovieCard(movie_id) {
    console.clear()

    // const api_key = '9eb7db00';
    const api_key = '91a335167db195d785887bd5b910de18';

    // const url = `http://www.omdbapi.com/?i=${movie_id}&apikey=${api_key}`;
    const url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${api_key}&language=en-US`

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            movie_data = JSON.parse(xhr.responseText)
            console.log(movie_data);
            createMovieCard(
                // movie_data.Title,
                // // movie_data.Year, 
                // movie_data.Plot,
                // movie_data.imdbRating,
                // movie_data.Poster
                movie_data.title,
                movie_data.overview,
                movie_data.vote_average,
                'https://image.tmdb.org/t/p/w300' + movie_data.poster_path
            )

        }
    };

    xhr.send();
}


// generateMovieCard('tt9032400')
// generateMovieCard('811367')
// generateMovieCard('811362')
// generateMovieCard('811369')
// generateMovieCard('811307')

function generateMovieCards(page = 1) {

    const api_key = '91a335167db195d785887bd5b910de18';

    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${api_key}&page=${page}`

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            movies = JSON.parse(xhr.responseText).results
            for (let movie_data of movies) {
                console.log(movie_data)
                createMovieCard(
                    // movie_data.Title,
                    // // movie_data.Year, 
                    // movie_data.Plot,
                    // movie_data.imdbRating,
                    // movie_data.Poster
                    movie_data.name || movie_data.title,
                    movie_data.overview,
                    movie_data.vote_average,
                    'https://image.tmdb.org/t/p/w300' + movie_data.poster_path
                );
            }
        }
    };

    xhr.send();

}



generateMovieCards();

let page = 1

function loadMore() {
    page++;
    generateMovieCards(page);
}