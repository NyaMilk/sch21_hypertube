const db = require('../config/psql-setup');

const putImage = (type, src, login) => {
    const sql =
        `UPDATE Users SET avatar[1] = $1, avatar[2] = $2 
    WHERE displayName = $3 RETURNING id`;

    return db.one(sql, [type, src, login]);
};

const getImage = (login) => {
    const sql =
        `SELECT avatar FROM Users WHERE displayName = $1`

    return db.any(sql, [login]);
}

exports.putImage = putImage;
exports.getImage = getImage;