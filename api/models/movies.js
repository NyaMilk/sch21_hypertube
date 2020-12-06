const { db, pgp } = require('../config/psql-setup');

exports.insertMovies = (data) => {
    const cs = new pgp.helpers.ColumnSet([
        'imdb',
        {name: 'engtitle', prop: 'engTitle'},
        {name: 'rutitle', prop: 'ruTitle'},
        'year',
        {name: 'engdescription', prop: 'engDescription'},
        {name: 'rudescription', prop: 'ruDescription'},
        'poster',
        {name: 'enggenres', prop: 'engGenres'},
        {name: 'rugenres', prop: 'ruGenres'},
        'runtime',
        'torrents'
    ], {table: 'movies'});
    
    const insert = pgp.helpers.insert(data, cs);

    return db.none(insert);
}

exports.getMovies = () => {
    const sql = 
    `SELECT torrents from movies`;

    return db.any(sql);
}

exports.getCountCards = (genres, sqlFilter) => {
    const sql =
        `SELECT * FROM Movies
    WHERE ${sqlFilter}`;

    return db.any(sql, [genres]);
}

exports.getCards = (genres, limit, sqlSort, sqlFilter) => {
    const sql =
        `SELECT title, imdb, EXTRACT(YEAR FROM dateRelease) AS year, poster, genres FROM Movies
    WHERE ${sqlFilter} ORDER BY ${sqlSort}
    LIMIT 9 OFFSET ($2 - 9)`;

    return db.any(sql, [genres, limit]);
}
