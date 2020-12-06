const router = require('express').Router();
const { getCountCards, getCards } = require('../models/movies');

router.post('/catalog/count', async (req, res) => {
    try {
        const { rateFrom, rateTo, yearFrom, yearTo, genres, search } = req.body;

        // тут проверку на A > B?
        // sqlFilter = `imdb >= ${rateFrom} AND imdb <= ${rateTo} AND EXTRACT(YEAR FROM year) BETWEEN ${yearFrom} AND ${yearTo} `;
        let sqlFilter = `EXTRACT(YEAR FROM dateRelease) BETWEEN ${yearFrom} AND ${yearTo} `;
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
})

router.post('/catalog/page', async (req, res) => {
    try {

        const { page, sort, rateFrom, rateTo, yearFrom, yearTo, genres, search } = req.body;
        let sqlSort = '',
            limit = page * 9;

        if (sort === 'yearAsc' || sort === 'yearDesc')
            sqlSort = (sort === 'yearAsc') ? 'year ASC' : 'year DESC';
        // sqlSort = (sort === 'yearAsc') ? 'year ASC, rate DESC' : 'year DESC, rate DESC';
        // else if (sort === 'rateAsc' || sort === 'rateDesc')
        //     sqlSort = (sort === 'rateAsc') ? 'rate ASC, year ASC' : 'rate DESC, year ASC';

        // тут проверку на A > B?
        // let sqlFilter = `AND imdb >= ${rateFrom} AND imdb <= ${rateTo} AND year >= ${yearFrom} AND year <= ${yearTo} `;
        let sqlFilter = `EXTRACT(YEAR FROM dateRelease) BETWEEN ${yearFrom} AND ${yearTo} `;
        if (genres.length > 0)
            sqlFilter += `AND genres && $1 `;

        if (search.length > 0)
            sqlFilter += `AND lower(title) like lower('%${search}%')`;

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
})

module.exports = router;