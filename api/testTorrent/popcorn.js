const axios = require("axios");

const getPopcornMovies = async () => {
    let raw = [];

    for (let i = 1; i <= 3; i++) {
        const res = await axios(`https://cors-anywhere.herokuapp.com/movies-v2.api-fetch.sh/movies/${i}`, { headers: { 'X-Requested-With': true } })
        raw.push(...res.data);
    }

    console.log(raw.length);
    let movies = [];
    movies = raw.map((movie, item) => {
        let formatMovie = new Object;
        const { imdb_id, title, synopsis, genres, torrents } = movie;
        formatMovie.imdb = imdb_id;
        formatMovie.title = title;
        formatMovie.synopsis = synopsis;
        formatMovie.genres = genres;
        formatMovie.torrents = [];

        if (torrents && torrents.en) {
            for (key in torrents.en)
                formatMovie.torrents.push([key, torrents.en[key].url]);
        }

        return (formatMovie.torrents.length > 0) ? formatMovie : null;
    })
    return movies;
}

const scrap = async () => {
    let tmp = await getPopcornMovies();
    console.log(tmp);
    return tmp
}
let tmp = scrap();
console.log(tmp);