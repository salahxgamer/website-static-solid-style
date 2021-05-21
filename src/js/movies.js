/**
 * Creates a new movie card and displays it on the page
 * @param  {String} title       Movie Title
 * @param  {String} description Movie Plot/Description
 * @param  {String} rating      Movie Rating, value between 0 and 10
 * @param  {String} posterURL   Movie Poster URL
 * @return {HTMLElement}        HTMLElement of the created movie card
 */
function createMovieCard(movie_id, title, description, rating, posterURL) {

    /**
     * Modifies the rating of a movie card by changing star styles
     * @param {HTMLElement} movie_rating stars container/parent
     * @param {Number} rating       rating value between 0 and 10
     */
    function setRating(movie_rating, rating) {
        // used to change type depending on the rating
        const star = '../../src/images/movie-card/star.svg' // filled star
        const e_star = '../../src/images/movie-card/e-star.svg' // Empty star
        const stars = movie_rating.getElementsByClassName('icon')

        for (let i = 0; i < stars.length; i++) {
            if (rating / 2 > 0)
                stars[i].style = star
            else
                stars[i].style = e_star
            rating -= 2;
        }
    }

    // duplicating movie card
    const movies_grid = document.getElementsByClassName('movies-grid')[0];
    const movie_card = document.getElementsByClassName('movie-card')[0].cloneNode(true);
    const movie_title = movie_card.getElementsByClassName('movie-title')[0];
    const movie_description = movie_card.getElementsByClassName('movie-description')[0];
    const movie_rating = movie_card.getElementsByClassName('movie-rating')[0];
    const movie_fav = movie_card.getElementsByClassName('movie-fav')[0];
    const movie_add = movie_card.getElementsByClassName('movie-add')[0];


    // modifying movie card informations
    movie_card.style.backgroundImage = `url(${posterURL})`
    movie_title.innerText = title
    movie_title.href = `movie.html?movie_id=${movie_id}`
    movie_description.innerText = description
    setRating(movie_rating, rating)
    movie_fav.dataset.movieId = movie_id
    movie_add.dataset.movieId = movie_id
    movie_card.classList.add('generated')

    return movies_grid.appendChild(movie_card)

}


/**
 * Generates movie card of a movie with the correspondant id
 * @param  {Number} movie_id Movie ID on TMDB
 * @return {Null}          returns nothing
 */
function generateMovieCard(movie_id) {

    const url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${api_key}`

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);


    // Response Handler
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            // console.log(xhr.status);
            movie_data = JSON.parse(xhr.responseText)
            // console.log(movie_data)
            createMovieCard(
                movie_data.id,
                movie_data.name || movie_data.title,
                movie_data.overview,
                movie_data.vote_average,
                'https://image.tmdb.org/t/p/w300' + movie_data.poster_path
            );
        }
    };

    xhr.send();


}


/**
 * Generate movie cards for trending movies
 * @param  {Number}    page Page number
 * @return {Null}      returns nothing
 */
function generateMovieCards(page = 1) {

    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${api_key}&page=${page}`

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    // Response Handler
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            movies = JSON.parse(xhr.responseText).results

            // create movie card for every movie
            for (let movie_data of movies) {
                // console.log(movie_data)
                createMovieCard(
                    movie_data.id,
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



// get URL parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// get page param
let page = urlParams.get('page') || 1

console.log(page);


// Initiate the page of trending movies
generateMovieCards(page);


/**
 * loads more movie cards
 * @return {Null} returns nothing
 */
function loadMore() {
    page++;
    // Change the current URL to have the updated page param
    urlParams.set('page', page)
    const nextUrl = window.location.origin + window.location.pathname + '?' + urlParams.toString();
    const nextTitle = `Movies Home | Page:${page}`
    // This will replace the current entry in the browser's history, without reloading
    window.history.replaceState({}, nextTitle, nextUrl);

    generateMovieCards(page);
}

/**
 * A unique array (Set) of user favorite movies by id
 * @type {Set}
 */
const favoriteMovies = new Set(readFromLocalStorage('favoriteMovies') || [])
/**
 * A unique array (Set) of user watch list movies by id
 * @type {Set}
 */
const watchListMovies = new Set(readFromLocalStorage('watchListMovies') || [])

/**
 * add movie to favorte list
 * @param  {Number} movie_id TMDB movie id
 */
function favorite(movie_id) {
    favoriteMovies.add(movie_id)
    // console.log(movie_id + ' added to favorite')
    writeToLocalStorage('favoriteMovies', [...favoriteMovies])
}
/**
 * add move to watch list
 * @param {Number} movie_id TMDB movie id
 */
function addToWatchList(movie_id) {
    watchListMovies.add(movie_id)
    // console.log(movie_id + ' added to watch list')
    writeToLocalStorage('watchListMovies', [...watchListMovies])
}


/**
 * Properly handles situation like 'localStorage not being supported by the browser' and excedding localSorage quota.
 Supports storing any kind of data
 * @param  {String} key   property key
 * @param  {Any} value    property value to store
 * @return {boolean}      true if succes else false
 */
function writeToLocalStorage(key, value) {
    if (typeof(Storage) == 'undefined') {
        alert("Your browser doesn't support HTML5 LocalStorage which this site make use of. Some features may not be available. Consider upgrading your browser to the latest version");
        return false;
    }

    value = JSON.stringify(value); //serializing non-string data types to string

    try {
        window.localStorage.setItem(key, value);
    } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
            alert('Local storage Quota exceeded! .Clearing localStorage');
            localStorage.clear();
            window.localStorage.setItem(key, value); //Try saving the preference again
        }
    }

    return true;
}


/**
 * Reads values from local storage handling errors
 * @param  {String} key Property key
 * @return {Any}        Property value
 */
function readFromLocalStorage(key) {
    if (typeof(Storage) == 'undefined') {
        //Broswer doesnt support local storage
        return null;
    }

    let value = JSON.parse(localStorage.getItem(key));
    return value;

}


/**
 * switch the view to : trending, watch list, favorite list
 * @param {String} view view mode : `trending`, 'watchList', `favorite`
 */
function setView(view = 'trending') {
    // Delete all the movies cards
    while (document.getElementsByClassName('movie-card generated')[0]) {
        document.getElementsByClassName('movie-card generated')[0].remove()
    }
    // Generate new movies cards
    switch (view) {
        case 'trending':
            page = 1
            generateMovieCards()
            break;
        case 'watchList':
            // Generate movie card for each movie
            for (let movie_id of watchListMovies) {
                // console.log(movie_id + ' is rendering')
                generateMovieCard(movie_id)
            }
            break;
        case 'favorite':
            // Generate movie card for each movie
            for (let movie_id of favoriteMovies) {
                // console.log(movie_id + ' is rendering')
                generateMovieCard(movie_id)
            }
            break;
        default:
            console.error(view, 'is an incorrect view type !')
            break;
    }
}