const db = require('../config/psql-setup');

const findUser = (nickname) => {
    const sql =
        `SELECT * FROM Users WHERE nickname = $1`;

    return db.any(sql, [nickname]);
};

exports.findUser = findUser;