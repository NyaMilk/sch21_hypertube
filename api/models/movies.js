const { db, pgp } = require('../config/psql-setup');

exports.insertMovies = (data) => {
    const cs = new pgp.helpers.ColumnSet([
        'imdb',
        { name: 'entitle', prop: 'enTitle' },
        { name: 'rutitle', prop: 'ruTitle' },
        'rate',
        { name: 'daterelease', prop: 'year' },
        { name: 'encountries', prop: 'enCountries' },
        { name: 'rucountries', prop: 'ruCountries' },
        { name: 'endescription', prop: 'enDescription' },
        { name: 'rudescription', prop: 'ruDescription' },
        { name: 'enposter', prop: 'enPoster' },
        { name: 'ruposter', prop: 'ruPoster' },
        { name: 'entrailer', prop: 'enTrailer' },
        { name: 'rutrailer', prop: 'ruTrailer' },
        { name: 'engenres', prop: 'enGenres' },
        { name: 'rugenres', prop: 'ruGenres' },
        'runtime',
        'torrents'
    ], { table: 'movies' });

    const insert = pgp.helpers.insert(data, cs);

    return db.none(insert);
}

exports.getMovie = (imdb) => {
    const sql =
        `SELECT * from movies WHERE imdb = $1`;

    return db.any(sql, imdb);
}

exports.getCountCards = (genres, sqlFilter) => {
    const sql =
        `SELECT * FROM Movies
    WHERE ${sqlFilter}`;

    return db.any(sql, [genres]);
}

exports.getCards = (genres, limit, sqlSort, sqlFilter) => {
    const sql =
        `SELECT enTitle, ruTitle, rate, imdb, EXTRACT(YEAR FROM dateRelease) AS year, enPoster, ruPoster, enGenres, ruGenres FROM Movies
    WHERE ${sqlFilter} ORDER BY ${sqlSort}
    LIMIT 16 OFFSET ($2 - 16)`;

    return db.any(sql, [genres, limit]);
}

exports.getFavorite = (me, film) => {
    const sql =
        `SELECT createdAt FROM FavoriteMovies
    WHERE idUser = (SELECT id FROM Users WHERE displayName = $1)
    AND idFilm = $2`;

    return db.any(sql, [me, film]);
}

exports.insertFavoriteFiml = (me, film) => {
    const sql =
        `INSERT INTO FavoriteMovies (idUser, idFilm)
    VALUES ((SELECT id FROM Users WHERE displayName = $1), $2)
    RETURNING createdAt`;

    return db.one(sql, [me, film]);
}

exports.deleteFavoriteFiml = (me, film) => {
    const sql =
        `DELETE FROM FavoriteMovies
    WHERE idUser = (SELECT id FROM Users WHERE displayName = $1)
    AND idFilm = $2
    RETURNING idFilm`;

    return db.one(sql, [me, film]);
}

exports.insertComment = (me, film, comment) => {
    const sql =
        `INSERT INTO Comments (idUser, idFilm, comment)
    VALUES ((SELECT id FROM Users WHERE displayName = $1), $2, $3)
    RETURNING createdAt`;

    return db.one(sql, [me, film, comment]);
}

exports.getComments = (me, film) => {
    const sql =
        `SELECT u.displayName, c.id, c.comment, c.createdAt, l.status,
    ((SELECT count(status) FROM CommentsLike WHERE idComment = c.id AND status LIKE 'like') -
    (SELECT count(status) FROM CommentsLike WHERE idComment = c.id AND status LIKE 'dislike')) count
    FROM Users u
    JOIN Comments c ON u.id = c.idUser
    LEFT JOIN (select status, idComment from CommentsLike WHERE idUser = (SELECT id FROM Users WHERE displayName=$1)) l
    ON l.idComment = c.id
    WHERE c.idFilm = $2`;

    return db.any(sql, [me, film]);
}

exports.checkStatus = (me, idComment) => {
    const sql =
        `SELECT status FROM CommentsLike
    WHERE idUser = (SELECT id FROM Users WHERE displayName=$1) AND idComment = $2`;

    return db.any(sql, [me, idComment]);
}

exports.updateStatus = (me, idComment, status) => {
    const sql =
        `UPDATE CommentsLike SET status = $3
        WHERE idUser = (SELECT id FROM Users WHERE displayName=$1) AND idComment = $2`;

    return db.any(sql, [me, idComment, status]);
}

exports.insertStatus = (me, idComment, status) => {
    const sql =
        `INSERT INTO CommentsLike (idUser, idComment, status)
    VALUES ((SELECT id FROM Users WHERE displayName=$1), $2, $3)`;

    return db.any(sql, [me, idComment, status]);
}

exports.deleteStatus = (me, idComment) => {
    const sql =
        `DELETE FROM CommentsLike
    WHERE idUser = (SELECT id FROM Users WHERE displayName=$1) AND idComment = $2
    RETURNING idComment`;

    return db.any(sql, [me, idComment]);
}

exports.getFavoriteMovies = (me) => {
    const sql = 
    `SELECT m.imdb, m.enTitle, m.enPoster, m.enGenres, m.enDescription, m.ruTitle, 
    m.ruPoster, m.ruGenres, m.ruDescription, m.runtime, f.createdAt FROM Movies m, FavoriteMovies f 
    WHERE m.imdb = f.idfilm AND f.idUser = 
    (SELECT id FROM Users WHERE displayName=$1)`;

    return db.any(sql, [me]);
}

exports.getProfileComments = (me) => {
    const sql = 
    `SELECT idFilm, comment, createdAt 
    FROM Comments 
    WHERE idUser = (SELECT id FROM Users WHERE displayName=$1)`

    return db.any(sql, [me]);
}

exports.deleteMovies = () => {
    const sql = `DELETE FROM MoviesLogs WHERE lastChange < CURRENT_DATE - 2 RETURNING path`;

    return db.any(sql);
}