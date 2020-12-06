const { db } = require('../config/psql-setup');

exports.getProfile = (nickname) => {
    const sql =
        `SELECT displayName, firstName, lastName, email, about, avatar
    FROM Users WHERE userName=$1`;

    return db.any(sql, [nickname]);
}

exports.editProfile = (que, params, i) => {
    const sql = `UPDATE Users SET ${que} WHERE nickName = $${i} RETURNING nickName`;

    return db.one(sql, params);
}
