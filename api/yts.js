const axios = require("axios");
axios('https://yts.lt/api/v2/list_movies.json?limit=50&page=1')
    .then(res => console.log(res.data.data.movies[0]))
    // .then(data => console.log(data))
    .catch((e) => console.log(e.message))