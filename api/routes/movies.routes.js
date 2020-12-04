const router = require('express').Router();
const { getCountCards, getCards } = require('../models/movies');

router.post('/catalog/count/pages', async (req, res) => {
    try {
        const { rateFrom, rateTo, yearFrom, yearTo, genre } = req.body;
        let sqlFilter = '';

        // тут проверку на A > B?
        sqlFilter = `AND age >= ${rateFrom} AND age <= ${rateTo} AND rate >= ${yearFrom} AND rate <= ${yearTo} `;
        if (genre.length > 0)
            sqlFilter += `AND genre && $1`;

        getCountCards(genre, sqlFilter)
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

router.post('/users/page', async (req, res) => {
    try {
        const { page, sort, rateFrom, rateTo, yearFrom, yearTo } = req.body;
        let sqlSort = '',
            sqlFilter = '',
            limit = page * 9;

        if (sort === 'yearAsc' || sort === 'yearDesc')
            sqlSort = (sort === 'yearAsc') ? 'year ASC, rate DESC' : 'year DESC, rate DESC';
        else if (sort === 'rateAsc' || sort === 'rateDesc')
            sqlSort = (sort === 'rateAsc') ? 'rate ASC, year ASC' : 'rate DESC, year ASC';

        // тут проверку на A > B?
        sqlFilter = `AND age >= ${rateFrom} AND age <= ${rateTo} AND rate >= ${yearFrom} AND rate <= ${yearTo} `;
        if (genre.length > 0)
            sqlFilter += `AND genre && $1`;

        getCards(genre, limit, sqlSort, sqlSortTags, sqlFilter)
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