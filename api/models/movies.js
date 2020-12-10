const { db, pgp } = require('../config/psql-setup');

exports.insertMovies = (data) => {
    const cs = new pgp.helpers.ColumnSet([
        'imdb',
        {name: 'entitle', prop: 'enTitle'},
        {name: 'rutitle', prop: 'ruTitle'},
        'rate',
        {name: 'daterelease', prop: 'year'},
        {name: 'endescription', prop: 'enDescription'},
        {name: 'rudescription', prop: 'ruDescription'},
        {name: 'enposter', prop: 'enPoster'},
        {name: 'ruposter', prop: 'ruPoster'},
        {name: 'engenres', prop: 'enGenres'},
        {name: 'rugenres', prop: 'ruGenres'},
        'runtime',
        'torrents'
    ], {table: 'movies'});
    
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
    LIMIT 9 OFFSET ($2 - 9)`;

    return db.any(sql, [genres, limit]);
}

exports.getFavorite = (me, film) => {
    const sql =
        `SELECT status FROM Favorite
    WHERE idUser = (SELECT id FROM Users WHERE displayName = $1)
    AND idFilm = $2`;
  
    return db.any(sql, [me, film]);
}
