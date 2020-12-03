const axios = require("axios");
const API_KEY = 'd022dfadcf20dc66d480566359546d3c';

const getPopcornMovies = async () => {
    let raw = [];

    for (let i = 1; i <= 1; i++) {
        const res = await axios(`https://cors-anywhere.herokuapp.com/movies-v2.api-fetch.sh/movies/${i}`, { headers: { 'X-Requested-With': true } })
        raw.push(...res.data);
    }

    let movies = [];
    movies = raw.map((movie, item) => {
        let formatMovie = new Object;
        const { imdb_id, title, synopsis, genres, torrents } = movie;
        formatMovie.imdb = imdb_id;
        formatMovie.engTitle = title;
        formatMovie.engSynopsis = synopsis;
        formatMovie.engGenres = genres;
        formatMovie.torrents = [];

        if (torrents && torrents.en) {
            for (key in torrents.en)
                formatMovie.torrents.push([key, torrents.en[key].url]);
        }

        return (formatMovie.torrents.length > 0) ? formatMovie : null;
    })
    return movies;
}

const getYtsMovies = async () => {
    let raw = [];

    for (let i = 1; i <= 1; i++) {
        const res = await axios(`https://yts.lt/api/v2/list_movies.json?limit=50&page=${i}`)
        raw.push(...res.data.data.movies);
    }

    let movies = [];
    movies = raw.map((movie, item) => {
        let formatMovie = new Object;
        const { imdb_code, title, synopsis, genres, torrents } = movie;
        formatMovie.imdb = imdb_code;
        formatMovie.engTitle = title;
        formatMovie.engSynopsis = synopsis;
        formatMovie.engGenres = genres;
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
}

const scrap = async () => {
    let pops = await getPopcornMovies();
    let yts = await getYtsMovies();

    let raw = pops.concat(yts);

    for (i = 0; i < raw.length; i++) {
        for (j = 0; j < raw.length; j++) {
            if (raw[i].imdb === raw[j].imdb) {
                raw.splice(j, 1);
            }
        }
    }

    console.log(raw.length);
    let movies = [];
    movies = await Promise.all(raw.map(async (movie) => {
        try {
            const res = await axios(`https://api.themoviedb.org/3/movie/${movie.imdb}?api_key=${API_KEY}&language=ru`);
            const { title, genres, overview, release_date, runtime, poster_path } = res.data;
            movie.ruTitle = title;
            movie.ruSynopsis = overview;
            movie.year = release_date;
            movie.runtime = runtime;
            movie.poster = poster_path;
            movie.ruGenres = [];

            if (genres) {
                for (let i = 0; i < genres.length; i++)
                    movie.ruGenres.push(genres[i].name);
            }

            return movie;
        } catch (e) {
            console.log('oops');
            return null;
        }
    }))

    const filtered = movies.filter((el) => {
        return el != null;
    });

    console.log(filtered[0]);
}
scrap();
// console.log(tmp);