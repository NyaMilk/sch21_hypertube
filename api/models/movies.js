const db = require('../config/psql-setup');

const getCountCards = (genre, sqlFilter) => {
    const sql = `
    SELECT * FROM FROM Movies WHERE ${sqlFilter}`;

    return db.any(sql, [genre]);
}

const getCards = (params, sort, sortTags, sqlFilter) => {
    const sql = `
    SELECT * FROM FROM Movies WHERE ${sqlFilter}`;

    return db.any(sql, params);
}

exports.getCountCards = getCountCards;
exports.getCards = getCards;