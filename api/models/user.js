const { db } = require('../config/psql-setup');

exports.getProfile = (you, me) => {
    const sql =
        `SELECT displayName, firstName, lastName, email, about, avatar, provider,
    (SELECT CASE WHEN EXISTS
    (SELECT 1 FROM Friends
    WHERE idFrom = (SELECT id FROM Users WHERE displayName=$2)
    AND idTo = (SELECT id FROM Users WHERE displayName=$1))
    THEN 1 ELSE 0 END)
    FROM Users WHERE displayName=$1`;

    return db.any(sql, [you, me]);
}

exports.editProfile = (que, params, i) => {
    const sql = `UPDATE Users SET ${que} WHERE displayName = $${i} RETURNING displayName`;

    return db.any(sql, params);
}

exports.insertFriend = (me, you) => {
    const sql =
        `INSERT INTO Friends (idFrom, idTo)
    VALUES ((SELECT id FROM Users WHERE displayName=$1), (SELECT id FROM Users WHERE displayName=$2))
    RETURNING idTo`;

    return db.any(sql, [me, you]);
}

exports.deleteFriend = (me, you) => {
    const sql =
        `DELETE FROM Friends
    WHERE idFrom = (SELECT id FROM Users WHERE displayName=$1)
    AND idTo = (SELECT id FROM Users WHERE displayName=$2)
    RETURNING idTo`;

    return db.any(sql, [me, you]);
}
