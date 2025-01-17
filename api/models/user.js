<<<<<<< HEAD
const db = require("../config/psql-setup");

const getMe = () => {
    const sql = `SELECT nickname from Users`;

    return db.any(sql);
};

exports.getMe = getMe;
=======
const { db } = require('../config/psql-setup');

exports.getProfile = (you, me) => {
    const sql =
        `SELECT displayName, firstName, lastName, email, about, avatar, provider,
    (SELECT CASE WHEN EXISTS
    (SELECT 1 FROM Friends
    WHERE idFrom = (SELECT id FROM Users WHERE displayName=$2)
    AND idTo = (SELECT id FROM Users WHERE displayName=$1))
    THEN 1 ELSE 0 END AS isFriend)
    FROM Users WHERE displayName=$1`;

    return db.any(sql, [you, me]);
}

exports.editProfile = (que, params, i) => {
    const sql = `UPDATE Users SET ${que} WHERE displayName = $${i} RETURNING displayName`;

    return db.any(sql, params);
}

exports.insertFriend = (me, you) => {
    const sql =
        `INSERT INTO Friends (idFrom, idTo)
    VALUES ((SELECT id FROM Users WHERE displayName=$1), (SELECT id FROM Users WHERE displayName=$2))
    RETURNING idTo`;

    return db.any(sql, [me, you]);
}

exports.deleteFriend = (me, you) => {
    const sql =
        `DELETE FROM Friends
    WHERE idFrom = (SELECT id FROM Users WHERE displayName=$1)
    AND idTo = (SELECT id FROM Users WHERE displayName=$2)
    RETURNING idTo`;

    return db.any(sql, [me, you]);
}

exports.getNotif = (me, title, poster) => {
    const sql =
        `SELECT m.imdb, n.quality, ${title} title, ${poster} poster
    FROM Movies m, Notifications n
    WHERE m.imdb = n.idFilm AND idUser = (SELECT id FROM Users WHERE displayName=$1)
    ORDER BY n.createdAt DESC`;

    return db.any(sql, [me, title, poster])
}

exports.addNotif = (me, imdb, quality) => {
    const sql =
        `INSERT INTO Notifications (idUser, idFilm, quality) 
    VALUES ((SELECT id FROM Users WHERE displayName = $1), $2, $3) 
    RETURNING idUser`;

    return db.any(sql, [me, imdb, quality]);
}

exports.getFavoriteMovies = (me) => {
    const sql =
        `SELECT m.imdb, m.enTitle, m.enPoster, m.enGenres, m.enDescription, m.ruTitle, 
    m.ruPoster, m.ruGenres, m.ruDescription, m.runtime, f.createdAt FROM Movies m, FavoriteMovies f 
    WHERE m.imdb = f.idfilm AND f.idUser = 
    (SELECT id FROM Users WHERE displayName=$1)`;

    return db.any(sql, [me]);
}

exports.getProfileComments = (me) => {
    const sql =
        `SELECT c.idFilm, c.comment, c.createdAt, m.enTitle, m.ruTitle, m.enPoster, m.ruPoster 
    FROM Comments c, Movies m 
    WHERE c.idFilm = m.imdb AND idUser = (SELECT id FROM Users WHERE displayName=$1)`;

    return db.any(sql, [me]);
}

exports.getProfileFriends = (me) => {
    const sql =
        `SELECT u.displayName, f.createdAt
    FROM Users u, Friends f
    WHERE u.id = f.idTo AND idFrom = (SELECT id FROM Users WHERE displayName=$1)`;

    return db.any(sql, [me]);
}
>>>>>>> rkina
