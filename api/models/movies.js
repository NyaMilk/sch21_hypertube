const db = require('../config/psql-setup');

const getCountCards = (genres, sqlFilter) => {
    const sql =
        `SELECT * FROM Movies
    WHERE ${sqlFilter}`;

    return db.any(sql, [genres]);
}

const getCards = (genres, limit, sqlSort, sqlFilter) => {
    const sql =
        `SELECT title, imdb, EXTRACT(YEAR FROM dateRelease) AS year, poster, genres FROM Movies
    WHERE ${sqlFilter} ORDER BY ${sqlSort}
    LIMIT 9 OFFSET ($2 - 9)`;

    return db.any(sql, [genres, limit]);
}

exports.getCountCards = getCountCards;
exports.getCards = getCards;