const { db } = require('../config/psql-setup');

exports.getProfile = (nickname) => {
    const sql =
        `SELECT displayName, firstName, lastName, email, about, avatar, provider
    FROM Users WHERE displayName=$1`;

    return db.any(sql, [nickname]);
}

exports.editProfile = (que, params, i) => {
    const sql = `UPDATE Users SET ${que} WHERE displayName = $${i} RETURNING displayName`;

    return db.any(sql, params);
}
