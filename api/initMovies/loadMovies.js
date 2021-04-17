const axios = require("axios");
const API_KEY = 'd022dfadcf20dc66d480566359546d3c';
const { getRate, getRuIso } = require('./rate');
const { insertMovies } = require('../models/movies');
<<<<<<< HEAD
const MAX_PAGES = 10;
=======
const MAX_PAGES = 1;
>>>>>>> 7d49b68b7ef72291cef0b81e840a421d6ae44bd4

const getPopcornMovies = async () => {
    let raw = [];

    console.log('*Loading popcorn movies*');
    for (let i = 1; i <= MAX_PAGES; i++) {
        try {
            const res = await axios(`https://cors-anywhere.herokuapp.com/movies-v2.api-fetch.sh/movies/${i}`, { headers: { 'X-Requested-With': true } });
            raw.push(...res.data);
            process.stdout.write(`\r*Loaded ${(i / MAX_PAGES * 100).toFixed(2)}% of popcorn movies*`);
        } catch (e) {
            continue
        }
    }

    let movies = [];
    movies = raw.map((movie, item) => {
        let formatMovie = new Object;
        const { imdb_id, title, synopsis, genres, torrents } = movie;

        if (!imdb_id || !title || !synopsis || !genres || !torrents)
            return null

        formatMovie.imdb = imdb_id;
        formatMovie.enTitle = title;
        formatMovie.rate = 0;
        formatMovie.enDescription = synopsis;
        formatMovie.enGenres = genres;
        formatMovie.torrents = [];

        if (torrents && torrents.en) {
            let qualities = new Set();
            for (quality in torrents.en) {
                if (!qualities.has(quality)) {
                    const torrent = [quality, torrents.en[quality].url];
                    formatMovie.torrents.push(torrent);
                    qualities.add(quality);
                }
            }
        }

        return (formatMovie.torrents.length > 0) ? formatMovie : null;
    })

    console.log('\n*Got popcorn movies*');
    return movies;
}

const getYtsMovies = async () => {
    let raw = [];

    console.log('*Loading YTS movies*');
    for (let i = 1; i <= MAX_PAGES; i++) {
        try {
            const res = await axios(`https://yts.lt/api/v2/list_movies.json?limit=50&page=${i}`)
            raw.push(...res.data.data.movies);
            process.stdout.write(`\r*Loaded ${(i / MAX_PAGES * 100).toFixed(2)}% of YTS movies*`);
        } catch (e) {
            continue
        }
    }

    let movies = [];
    movies = raw.map((movie, item) => {
        let formatMovie = new Object;
        const { imdb_code, title, synopsis, genres, torrents } = movie;

        if (!imdb_code || !title || !synopsis || !genres || !torrents)
            return null

        formatMovie.imdb = imdb_code;
        formatMovie.enTitle = title;
        formatMovie.rate = 0;
        formatMovie.enDescription = synopsis;
        formatMovie.enGenres = genres;
        formatMovie.torrents = [];

        if (torrents) {
            let qualities = new Set();
            for (item in torrents) {
                const { quality, hash } = torrents[item];
                if (!qualities.has(quality)) {
                    const url = `magnet:?xt=urn:btih:${hash}`;
                    const torrent = [quality, url];
                    formatMovie.torrents.push(torrent);
                    qualities.add(quality);
                }
            }
        }

        return (formatMovie.torrents.length > 0) ? formatMovie : null;
    })

    console.log('\n*Got YTS movies*');
    return movies;
}

const filterMovies = async () => {
    let pops = await getPopcornMovies();
    let yts = await getYtsMovies();
    let raw = pops.concat(yts);

    raw = raw.filter((el) => {
        return el != null;
    });

    for (i = 0; i < raw.length; i++) {
        for (j = 0; j < raw.length; j++) {
            if (raw[i].imdb === raw[j].imdb) {
                raw.splice(j, 1);
            }
        }
    }

    let movies = [];
    movies = await Promise.all(raw.map(async (movie) => {
        try {
            if (!movie.imdb)
                return null;

            const res = await axios(`https://api.themoviedb.org/3/movie/${movie.imdb}?api_key=${API_KEY}&append_to_response=videos&language=ru`);
            const enRes = await axios(`https://api.themoviedb.org/3/movie/${movie.imdb}?api_key=${API_KEY}&append_to_response=videos&language=en`);
            const en_poster_path = enRes.data.poster_path;
            const enVideos = enRes.data.videos.results[0].key;
            const { title, genres, overview, release_date, runtime, poster_path, production_countries, videos } = res.data;

            if (!title || !genres || !overview || !release_date || !runtime || !poster_path
                || !production_countries || !enVideos || !videos.results[0].key || !en_poster_path || !title.match(/[А-я]$/))
                return null;

            movie.enCountries = production_countries.map((item) => {
                return item.name;
            })

            movie.ruCountries = production_countries.map((item) => {
                return getRuIso(item['iso_3166_1']);
            })

            movie.ruTitle = title;
            movie.enPoster = en_poster_path;
            movie.enTrailer = enVideos;
            movie.ruTrailer = videos.results[0].key;
            movie.ruDescription = overview;
            movie.year = release_date;
            movie.runtime = runtime;
            movie.ruPoster = poster_path;
            movie.ruGenres = [];

            if (!movie.enTrailer || !movie.ruTrailer)
                return null;

            if (genres) {
                for (let i = 0; i < genres.length; i++)
                    movie.ruGenres.push(genres[i].name);
            }

            return movie;
        } catch (e) {
            return null;
        }
    }))

    const filtered = movies.filter((el) => {
        return el != null;
    });

    console.log('*Movies filtered*');
    return filtered;
}

const scrap = async () => {
    let filtered = await filterMovies();

    const moviesWithRate = filtered.map((item) => {
        const newRate = getRate(item.imdb);

        if (!newRate)
            return null;

        item.rate = newRate;
        return item;
    })

    const final = moviesWithRate.filter((el) => {
        return el != null;
    });

    console.log(`*${final.length} films finally scrapped and cleared*`);
    return final;
}

const addToDB = async () => {
    try {
        const final = await scrap();

        insertMovies(final)
            .then(() => console.log('Film added to db'))
            .catch(e => console.log(e.message))
    } catch (e) {
        console.log(e.message);
    }
}

addToDB();