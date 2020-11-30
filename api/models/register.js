const db = require('../config/psql-setup');

const sign = (username, firstname, lastname, email, password) => {
    const sql =
        `INSERT INTO Users (userName, firstName, lastName, email, password) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING userName`;

    return db.one(sql, [username, firstname, lastname, email, password]);
};

const getOnlyPass = (username) => {
    const sql =
        `SELECT password FROM Users 
    WHERE userName=$1 AND provider = 'hypert'`;

    return db.any(sql, [username]);
}

const getEmail = (email) => {
    const sql =
        `SELECT id FROM Users 
    WHERE email=$1 AND provider = 'hypert'`;

    return db.any(sql, [email]);
}

const getLogin = (username) => {
    const sql =
        `SELECT id FROM Users 
    WHERE userName=$1 AND provider = 'hypert'`;

    return db.any(sql, [username]);
}

const addConfirmHash = (hash, username) => {
    const sql =
        `UPDATE Users
    SET confirmHash = $1
    WHERE userName = $2
    RETURNING id`;

    return db.any(sql, [hash, username]);
}

const getConfirmHash = (username) => {
    const sql =
        `SELECT confirmHash, createdAt FROM Users
    WHERE userName = $1`;

    return db.any(sql, [username]);
}

const userDel = (username) => {
    const sql =
        `DELETE FROM Users 
    WHERE userName = $1 RETURNING id`;

    return db.any(sql, [username]);
}

const confirmUser = (username) => {
    const sql =
        `UPDATE Users 
    SET confirm = true
    WHERE userName = $1
    RETURNING id`;

    return db.any(sql, [username]);
}

exports.sign = sign;
exports.getOnlyPass = getOnlyPass;
exports.getEmail = getEmail;
exports.getLogin = getLogin;
exports.addConfirmHash = addConfirmHash;
exports.getConfirmHash = getConfirmHash;
exports.userDel = userDel;
exports.confirmUser = confirmUser;
