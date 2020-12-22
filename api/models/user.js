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

exports.insertFriend = (me, you) => {
    const sql =
        `INSERT INTO Friends (idFrom, idTo)
    VALUES ((SELECT id FROM Users WHERE displayName=$1), (SELECT id FROM Users WHERE displayName=$2))`;

    return db.any(sql, [me, you]);
}

exports.deleteFriend = (me, you) => {
    const sql =
        `DELETE FROM Friends
    WHERE idFrom = (SELECT id FROM Users WHERE displayName=$1)
    AND idTo = (SELECT id FROM Users WHERE displayName=$2)`;

    return db.any(sql, [me, you]);
}
