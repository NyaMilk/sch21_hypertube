const db = require('../config/psql-setup');

const getUsers2 = (params) => {
    const sql =
        `SELECT * FROM Users`;

    return db.any(sql, params);
};

exports.getUsers2 = getUsers2;