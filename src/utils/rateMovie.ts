import Movie from "../interfaces/Movie";

function rateMovie(moviesDB: Movie[], selectedMovie: Movie, rate: number) {
    const foundMovieIndex = moviesDB.indexOf(selectedMovie)
    const foundMovie = moviesDB[foundMovieIndex]
    foundMovie.ratings.push(rate)
    console.log(foundMovie)
    return foundMovie
}

export default rateMovie