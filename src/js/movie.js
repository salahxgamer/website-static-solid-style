function getMovieData(movie_id, callback) {

    const url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${api_key}`

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            movie_data = JSON.parse(xhr.responseText)
            console.log(movie_data)
            callback(
                movie_data.id,
                movie_data.name || movie_data.title,
                movie_data.genres.map(genreItem => genreItem.name),
                movie_data.overview,
                movie_data.vote_average,
                'https://image.tmdb.org/t/p/w300' + movie_data.poster_path,
                movie_data.video
            );
        }
    };

    xhr.send();


}


const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const movie_id = urlParams.get('movie_id')

console.log(movie_id);

getMovieData(movie_id, (id, title, genres, description, rating, poster, hasTrailer) => {

    function setGenres(genres = ['Genre']) {
        while (genres.length) {
            genre = genres.shift()
            genreCard = movie_genres.getElementsByClassName('movie-genre')[0].cloneNode(true)
            genreCard.innerText = genre
            genreCard.classList.remove('hidden')
            movie_genres.appendChild(genreCard)
        }
    }

    function setTrailer() {
        const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${api_key}`

        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                movieVideos = JSON.parse(xhr.responseText)
                if (movieVideos.results[0].site == 'YouTube')
                    movie_trailer.src = `https://www.youtube.com/embed/${movieVideos.results[0].key}`
            }
        };

        xhr.send();

    }
    // duplicating movie card
    const movie_poster = document.getElementsByClassName('poster')[0];
    const movie_title = document.getElementsByClassName('movie-title')[0];
    const movie_description = document.getElementsByClassName('movie-description')[0];
    const movie_rating = document.getElementsByClassName('movie-rating')[0];
    const movie_genres = document.getElementsByClassName('genre-container')[0];
    const movie_trailer = document.getElementsByClassName('trailer-player')[0];


    // modifying movie card informations
    movie_poster.src = poster
    movie_title.innerText = title
    movie_description.innerText = description
    setTrailer(id)
    setGenres(genres)

})