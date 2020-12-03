const axios = require("axios");
const API_KEY = 'd022dfadcf20dc66d480566359546d3c';
const imdb = 'tt10353866';

axios(`https://api.themoviedb.org/3/movie/${imdb}?api_key=${API_KEY}&language=ru`)
    .then(res => console.log(res.data))