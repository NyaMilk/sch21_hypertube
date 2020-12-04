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