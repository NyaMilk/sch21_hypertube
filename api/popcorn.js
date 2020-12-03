const axios = require("axios");
axios('https://cors-anywhere.herokuapp.com/movies-v2.api-fetch.sh/movies/1', {
    headers: {
        'X-Requested-With': true
    }
})
    .then(res => console.log(res))
    .catch((e) => console.log(e.message))