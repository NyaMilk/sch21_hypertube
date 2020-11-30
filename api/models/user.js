const db = require('../config/psql-setup');

const getProfile = (nickname) => {
    const sql =
        `SELECT userName, firstName, lastName, email, about, photos
    FROM Users WHERE nickName=$1`;

    return db.any(sql, [nickname]);
}

const editProfile = (que, params, i) => {
    const sql = `UPDATE Users SET ${que} WHERE nickName = $${i} RETURNING nickName`;

    return db.one(sql, params);
}

exports.getProfile = getProfile;
exports.editProfile = editProfile;