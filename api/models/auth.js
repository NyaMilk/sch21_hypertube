const db = require("../config/psql-setup");

const checkUserName = (username) => {
    const sql = `SELECT username from Users WHERE username = $1`;

    return db.any(sql, [username]);
};

exports.checkUserName = checkUserName;
