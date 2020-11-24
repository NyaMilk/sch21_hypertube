const db = require("../config/psql-setup");

const getMe = () => {
    const sql = `SELECT nickname from Users`;

    return db.any(sql);
};

exports.getMe = getMe;
