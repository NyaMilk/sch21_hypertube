const { db } = require('../config/psql-setup');

exports.findUserOauth = (username, provider) => {
    const sql =
        `SELECT displayName, password, confirm 
    FROM Users WHERE userName = $1 AND provider = $2`;

    return db.any(sql, [username, provider]);
};

exports.findUserLocalAuth = (username, provider) => {
    const sql =
        `SELECT displayName, password, confirm 
    FROM Users WHERE displayName = $1 AND provider = $2`;

    return db.any(sql, [username, provider]);
};

exports.findUserInAllProviders = (username) => {
    const sql =
        `SELECT displayName 
    FROM Users WHERE displayName = $1`;

    return db.any(sql, [username]);
};

exports.addUser = (username, email, provider) => {
    const sql =
        `INSERT INTO Users (displayName, userName, email, provider, confirm) 
    VALUES ($1, $1, $2, $3, true) RETURNING id`;

    return db.one(sql, [username, email, provider]);
}

exports.addFullUser = (username, email, firstName, lastName, provider) => {
    const sql =
        `INSERT INTO Users (displayName, userName, email, firstName, lastName, provider) 
    VALUES ($1, $1, $2, $3, $4, $5) RETURNING id`;

    return db.one(sql, [username, email, firstName, lastName, provider]);
}
