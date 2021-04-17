const keys = require("./keys");
const pgp = require('pg-promise')();
const db = pgp(keys.DB_URL);

<<<<<<< HEAD
module.exports = db;
=======
exports.pgp = pgp;
exports.db = db;
>>>>>>> rkina
