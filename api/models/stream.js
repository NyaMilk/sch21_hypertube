const { db } = require('../config/psql-setup');

exports.getMagnet = (imdb, index) => {
    const sql =
        `SELECT torrents[$2][2] 
    FROM movies 
    WHERE imdb = $1`;

    return db.one(sql, [imdb, index]);
}

exports.getMoviePath = (imdb, quality) => {
    const sql =
        `SELECT path from moviesLogs
    WHERE idFilm = $1 and quality = $2`;

    return db.one(sql, [imdb, quality]);
}

exports.updateMovie = (imdb, quality, time) => {
    const sql =
        `UPDATE moviesLogs SET lastChange = $3
    WHERE idFilm = $1 and quality = $2
    RETURNING idFilm`;

    return db.any(sql, [imdb, quality, time]);
}

exports.setMoviePath = (imdb, quality, path) => {
    const sql =
        `UPDATE moviesLogs SET path = $3  
    WHERE idFilm = $1 and quality = $2
    RETURNING idFilm`;

    return db.any(sql, [imdb, quality, path]);
}

exports.setMovieStatus = (imdb, quality, status) => {
    const sql =
        `INSERT INTO moviesLogs (idFilm, quality, status) VALUES ($1, $2, $3)
    RETURNING idFilm`;

    return db.any(sql, [imdb, quality, status]);
}

exports.updateMovieStatus = (imdb, quality, status) => {
    const sql =
        `UPDATE moviesLogs SET status = $3
        WHERE idFilm = $1 and quality = $2
        RETURNING idFilm`;

    return db.any(sql, [imdb, quality, status]);
}