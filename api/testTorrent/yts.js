const axios = require("axios");
axios('https://yts.lt/api/v2/list_movies.json?limit=50&page=1')
    .then(res => {
        let movies = [];
        const raw = res.data.data.movies;
        movies = raw.map((movie, item) => {
            let formatMovie = new Object;
            const { imdb_code, title, synopsis, genres, torrents } = movie;
            formatMovie.imdb = imdb_code;
            formatMovie.title = title;
            formatMovie.synopsis = synopsis;
            formatMovie.genres = genres;
            formatMovie.torrents = [];

            if (torrents) {
                for (item in torrents) {
                    const { quality, hash } = torrents[item];
                    const url = `magnet:?xt=urn:btih:${hash}`;
                    formatMovie.torrents.push([quality, url]);
                }
            }

            return (formatMovie.torrents.length > 0) ? formatMovie : null;
        })
        return movies;
    })
    .catch((e) => console.log(e.message))