const { db } = require('../config/psql-setup');

const getMagnets = (imdb) => {
    const sql =
        `SELECT torrents 
    FROM movies 
    WHERE imdb = $1`;

    return db.one(sql, [imdb]);
}

exports.getMagnet = async (imdb, index) => {
    const sql =
        `SELECT torrents[$2][2] 
    FROM movies 
    WHERE imdb = $1`;

    return db.one(sql, [imdb, index]);
}

exports.setMoviePath = (imdb, index, path) => {
    const sql =
        `UPDATE movies SET torrents[$2][3] = 'downloaded', torrents[$2][4] = $3  
    WHERE imdb = $1
    RETURNING imdb`;

    return db.any(sql, [imdb, index, path]);
}

exports.setMovieStatus = (imdb, quality, status) => {
    const sql =
        `INSERT INTO MoviesLogs (idFilm, quality, status) VALUES 
        ($1, $2, $3) RETURNING idFilm`;

    return db.any(sql, [imdb, quality, status]);
}