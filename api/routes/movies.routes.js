const router = require('express').Router();
const fs = require('fs');
const { getCountCards, getCards, getMovie, getFavorite, deleteFavoriteFiml, insertFavoriteFiml, insertComment, getComments,
    checkStatus, updateStatus, insertStatus, deleteStatus } = require('../models/movies');

router.post('/catalog/count', async (req, res) => {
    try {
        const { rateFrom, rateTo, yearFrom, yearTo, genres, search } = req.body;

        // тут проверку на A > B?
        let sqlFilter = `rate >= ${rateFrom} AND rate <= ${rateTo} AND EXTRACT(YEAR FROM dateRelease) BETWEEN ${yearFrom} AND ${yearTo} `;
        if (genres.length > 0)
            sqlFilter += `AND genres && $1 `;

        if (search.length > 0)
            sqlFilter += `AND lower(title) like lower('%${search}%')`;


        getCountCards(genres, sqlFilter)
            .then(data => {
                if (data.length > 0) {
                    res.status(200).json({
                        result: data.length,
                        message: "Ok",
                        success: true
                    });
                }
                else
                    res.status(200).json({
                        message: "No films",
                        success: false
                    })
            })
            .catch(() => {
                res.status(200).json({
                    message: "Ooops! Cannot find films. Try again",
                    success: false
                })
            })
    } catch (e) {
        res.status(200).json({
            message: "Ooops! Cannot find films. Try again",
            success: false
        })
    }
});

router.post('/catalog/page/:lang', async (req, res) => {
    try {

        const { page, sort, rateFrom, rateTo, yearFrom, yearTo, genres, search } = req.body,
            { lang } = req.params;

        let sqlSort = '',
            title,
            limit = page * 16;

        if (sort === 'yearAsc' || sort === 'yearDesc')
            sqlSort = (sort === 'yearAsc') ? 'year ASC, rate DESC' : 'year DESC, rate DESC';
        if (sort === 'rateAsc' || sort === 'rateDesc')
            sqlSort = (sort === 'rateAsc') ? 'rate ASC, year ASC' : 'rate DESC, year ASC';
        if (sort === 'nameAsc' || sort === 'nameDesc') {
            title = (lang === 'en') ? 'entitle' : 'rutitle';
            sqlSort = (sort === 'nameAsc') ? `${title} ASC, rate DESC` : `${title} DESC, rate DESC`;
        }

        // тут проверку на A > B?
        let sqlFilter = `rate >= ${rateFrom} AND rate <= ${rateTo} AND EXTRACT(YEAR FROM dateRelease) BETWEEN ${yearFrom} AND ${yearTo} `;
        if (genres.length > 0)
            sqlFilter += `AND genres && $1 `;

        if (search.length > 0)
            sqlFilter += `AND lower(entitle) like lower('%${search}%') OR lower(rutitle) like lower('%${search}%')`;

        getCards(genres, limit, sqlSort, sqlFilter)
            .then(data => {
                if (data.length > 0) {
                    res.status(200).json({
                        result: data,
                        message: "Ok",
                        success: true
                    });
                }
                else
                    res.status(200).json({
                        message: "No film",
                        success: false
                    })
            })
            .catch(() => {
                res.status(200).json({
                    message: "Ooops! Cannot find film. Try again",
                    success: false
                })
            })
    } catch (e) {
        res.status(200).json({
            message: "Ooops! Cannot find film. Try again",
            success: false
        })
    }
});

router.get('/movie/:imdb', function (req, res) {
    const { imdb } = req.params;

    getMovie(imdb)
        .then(data => {
            if (data.length > 0)
                res.status(200).json({
                    success: true,
                    data: data[0]
                })
            else
                res.status(200).json({
                    success: false,
                    message: 'Nothing found'
                })
        })
        .catch(() => {
            res.status(200).json({
                success: false,
                message: 'Nothing found'
            })
        })
});

router.get('/video/:imdb/:quality', function (req, res) {
    const { imdb, quality } = req.params;
    let path;
    if (quality == '720')
        path = 'data/test.mp4';
    else
        path = 'data/test2.mp4';


    const stat = fs.statSync(path);


    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1
        const chunksize = (end - start) + 1
        const file = fs.createReadStream(path, { start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
});

router.post('/movie/favorite', async (req, res) => {
    try {
        const { me, film } = req.body;

        getFavorite(me, film)
            .then(data => {
                if (data.length > 0)
                    res.status(200).json({
                        result: "add",
                        message: "Ok",
                        success: true
                    });
                else
                    res.status(200).json({
                        result: "none",
                        message: "Ok",
                        success: true
                    });
            })
            .catch(() => {
                res.status(200).json({
                    message: "Ooops! Cannot find favorite. Try again",
                    success: false
                })
            })
    }
    catch (e) {
        res.status(200).json({
            message: "Ooops! Cannot find favorite. Try again",
            success: false
        })
    }
});

router.post('/movie/favorite/update', async (req, res) => {
    try {
        const { me, film, status, newStatus } = req.body;
        const promise = (status === 'add') ? deleteFavoriteFiml(me, film) : insertFavoriteFiml(me, film);

        promise
            .then(data => {
                if (data)
                    res.status(200).json({
                        result: newStatus,
                        message: "Ok",
                        success: true
                    });
                else
                    res.status(200).json({
                        message: "No favorite",
                        success: false
                    })
            })
            .catch(() => {
                res.status(200).json({
                    message: "Ooops! Cannot update favorite. Try again",
                    success: false
                })
            })

    }
    catch (e) {
        res.status(200).json({
            message: "Ooops! Cannot update favorite. Try again",
            success: false
        })
    }
});

router.post('/movie/comment', async (req, res) => {
    try {
        const { me, film, comment } = req.body;

        insertComment(me, film, comment)
            .then(() => {
                res.status(200).json({
                    message: "Ok",
                    success: true
                });
            })
            .catch(() => {
                res.status(200).json({
                    message: "Ooops! Cannot update comment. Try again",
                    success: false
                })
            })
    }
    catch (e) {
        res.status(200).json({
            message: "Ooops! Cannot update comment. Try again",
            success: false
        })
    }
});

router.post('/movie/comments', async (req, res) => {
    try {
        const { me, film } = req.body;

        getComments(me, film)
            .then(data => {
                res.status(200).json({
                    data: data,
                    success: true
                })
            })
            .catch(() => {
                res.status(200).json({
                    success: false,
                    message: "Ooops! Not found comments"
                })
            })
    }
    catch (e) {
        res.status(200).json({
            success: false,
            message: "Ooops! Not found comments"
        })
    }
});

router.post('/movie/comment/like', async (req, res) => {
    try {
        const { me, idComment, status } = req.body;

        checkStatus(me, idComment)
            .then((data) => {
                if (data.length > 0) {
                    if (status === data[0].status) {
                        deleteStatus(me, idComment)
                            .then((data) => {
                                res.status(200).json({
                                    message: "Ok",
                                    success: true
                                })
                            })
                            .catch((e) => {
                                res.status(200).json({
                                    message: "Ooops! Cannot update like. Try again",
                                    success: false
                                })
                            })
                    }
                    else {
                        updateStatus(me, idComment, status)
                            .then(() => {
                                res.status(200).json({
                                    message: "Ok",
                                    success: true
                                })
                            })
                            .catch(() => {
                                res.status(200).json({
                                    message: "Ooops! Cannot update like. Try again",
                                    success: false
                                })
                            })
                    }
                }
                else {
                    insertStatus(me, idComment, status)
                        .then(() => {
                            res.status(200).json({
                                message: "Ok",
                                success: true
                            })
                        })
                        .catch(() => {
                            res.status(200).json({
                                message: "Ooops! Cannot update like. Try again",
                                success: false
                            })
                        })
                }
            })
            .catch(() => {
                res.status(200).json({
                    message: "Ooops! Cannot update like. Try again",
                    success: false
                })
            })
    }
    catch (e) {
        res.status(200).json({
            message: "Ooops! Cannot update like. Try again" + e.message,
            success: false
        })
    }
});


module.exports = router;