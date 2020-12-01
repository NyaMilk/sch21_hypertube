const db = require('../config/psql-setup');

const findUserOauth = (username, provider) => {
    const sql =
        `SELECT displayName, password, confirm 
    FROM Users WHERE userName = $1 AND provider = $2`;

    return db.any(sql, [username, provider]);
};

const findUserLocalAuth = (username, provider) => {
    const sql =
        `SELECT displayName, password, confirm 
    FROM Users WHERE displayName = $1 AND provider = $2`;

    return db.any(sql, [username, provider]);
};

const findUserInAllProviders = (username) => {
    const sql =
        `SELECT displayName 
    FROM Users WHERE displayName = $1`;

    return db.any(sql, [username]);
};

const addUser = (username, email, provider) => {
    const sql =
        `INSERT INTO Users (displayName, userName, email, provider) 
    VALUES ($1, $1, $2, $3) RETURNING id`;

    return db.one(sql, [username, email, provider]);
}

const addFullUser = (username, email, firstName, lastName, provider) => {
    const sql =
        `INSERT INTO Users (displayName, userName, email, firstName, lastName provider) 
    VALUES ($1, $2, $3, $4, $5) RETURNING id`;

    return db.one(sql, [username, email, firstName, lastName, provider]);
}

exports.findUserOauth = findUserOauth;
exports.findUserLocalAuth = findUserLocalAuth;
exports.findUserInAllProviders = findUserInAllProviders;
exports.addUser = addUser;
exports.addFullUser = addFullUser;