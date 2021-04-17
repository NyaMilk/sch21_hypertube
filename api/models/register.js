const { db } = require('../config/psql-setup');

exports.sign = (username, firstname, lastname, email, password) => {
    const sql =
        `INSERT INTO Users (displayName, userName, firstName, lastName, email, password) 
    VALUES ($1, $1, $2, $3, $4, $5) 
    RETURNING userName`;

    return db.one(sql, [username, firstname, lastname, email, password]);
};

exports.getOnlyPass = (username) => {
    const sql =
        `SELECT password FROM Users 
    WHERE userName=$1 AND provider = 'hypert'`;

    return db.any(sql, [username]);
}

exports.getEmail = (email) => {
    const sql =
        `SELECT id FROM Users 
    WHERE email=$1`;

    return db.any(sql, [email]);
}

exports.getLogin = (username) => {
    const sql =
        `SELECT id FROM Users 
    WHERE userName=$1`;

    return db.any(sql, [username]);
}

exports.addConfirmHash = (hash, username) => {
    const sql =
        `UPDATE Users
    SET confirmHash = $1
    WHERE userName = $2
    RETURNING id`;

    return db.any(sql, [hash, username]);
}

exports.getConfirmHash = (username) => {
    const sql =
        `SELECT confirmHash, createdAt FROM Users
    WHERE userName = $1`;

    return db.any(sql, [username]);
}

exports.userDel = (username) => {
    const sql =
        `DELETE FROM Users 
    WHERE userName = $1 RETURNING id`;

    return db.any(sql, [username]);
}

exports.confirmUser = (username) => {
    const sql =
        `UPDATE Users 
    SET confirm = true
    WHERE userName = $1
    RETURNING id`;

    return db.any(sql, [username]);
}
