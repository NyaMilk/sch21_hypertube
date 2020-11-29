const db = require('../config/psql-setup');

const findUser = (nickname, provider) => {
    const sql =
        `SELECT * FROM Users WHERE nickname = $1 AND provider = $2`;

    return db.any(sql, [nickname, provider]);
};

exports.findUser = findUser;