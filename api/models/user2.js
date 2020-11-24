const db = require("../config/psql-setup");

const getMe2 = () => {
    const sql = `SELECT nickname from Users`;

    return db.any(sql);
};

exports.getMe2 = getMe2;
