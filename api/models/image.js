const db = require('../config/psql-setup');

const putImage = (type, src, login) => {
    const sql =
        `UPDATE Users SET avatar[0] = $1, avatar[1] = $2 
    WHERE userName = $3 RETURNING id`;

    return db.one(sql, [type, src, login]);
};

const getImage = (login) => {
    const sql =
        `SELECT avatar FROM Users WHERE userName = $1`

    return db.any(sql, [login]);
}

exports.putImage = putImage;
exports.getImage = getImage;