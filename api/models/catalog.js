const { db } = require('../config/psql-setup');

exports.getUsers2 = (params) => {
    const sql =
        `SELECT * FROM Users`;

    return db.any(sql, params);
};
