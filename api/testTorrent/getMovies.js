const { getMovies } = require('./../models/movies');

getMovies()
    .then(data => console.log(data[0].torrents))
    .catch(e => console.log(e.message))
