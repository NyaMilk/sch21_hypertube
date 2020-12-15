const { db } = require('../config/psql-setup');

exports.addDownload = (quality, path, imdb) => {
    const sql =
        `UPDATE movies
        SET downloads = downloads || ARRAY[$1]
        WHERE imdb = $2 returning id`;

    let obj = new Object;
    obj.quality = quality;
    obj.path = path;
    obj.time = new Date;

    return db.any(sql, [JSON.stringify(obj), imdb])
}

exports.deleteDownload = (imdb, position) => {
    const sql =
        `SELECT downloads 
        FROM movies 
        WHERE id = 10`;

    return db.any(sql);
}

const getMagnets = (imdb) => {
    const sql =
        `SELECT torrents 
        FROM movies 
        WHERE imdb = $1`;

    return db.one(sql, [imdb]);
}

exports.getMagnet = async (imdb, quality) => {
    const magnets = await getMagnets(imdb);
    console.log('magnets', magnets);
    const magnet = magnets.torrents.filter((item) => {
        return item[0] === quality
    })
    console.log('filtered magnet', magnet);
    if (magnet.length > 0)
        return magnet[0][1];
    return null;
}

const getDownload = (imdb) => {
    const sql =
        `SELECT downloads
    FROM movies 
    WHERE imdb = $1`;

    return db.one(sql, [imdb]);
};

exports.getPath = async (imdb, quality) => {
    const data = await getDownload(imdb);
    console.log(data);
    if (!data.downloads)
        return null;

    const movies = data.downloads.map((item) => {
        return JSON.parse(item)
    });

    const filtered = movies.filter((item) => {
        return item.quality == quality
    })

    if (filtered.length > 0)
        return filtered[0].path

    return null;
}

const updateDownload = (data, imdb) => {
    const sql =
        `UPDATE movies
    SET downloads = $1
    WHERE imdb = $2
    RETURNING id`;

    return db.one(sql, [data, imdb]);
}

exports.updateMovie = async (imdb, quality) => {
    const data = await getDownload(imdb);
    const movies = data.downloads.map((item) => {
        const tmp = JSON.parse(item);
        if (tmp.quality === quality) {
            tmp.time = new Date;
        }

        return JSON.stringify(tmp);
    });

    const res = await updateDownload(movies, imdb);
    console.log(res);
    return (res) ? true : false;
}