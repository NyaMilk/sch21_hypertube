const router = require('express').Router();
const fs = require('fs');
const { getCountCards, getCards } = require('../models/movies');

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
})

router.post('/catalog/page', async (req, res) => {
    try {

        const { page, sort, rateFrom, rateTo, yearFrom, yearTo, genres, search } = req.body;
        let sqlSort = '',
            limit = page * 9;

        if (sort === 'yearAsc' || sort === 'yearDesc')
            sqlSort = (sort === 'yearAsc') ? 'year ASC, rate DESC' : 'year DESC, rate DESC';
        else if (sort === 'rateAsc' || sort === 'rateDesc')
            sqlSort = (sort === 'rateAsc') ? 'rate ASC, year ASC' : 'rate DESC, year ASC';

        // тут проверку на A > B?
        let sqlFilter = `rate >= ${rateFrom} AND rate <= ${rateTo} AND EXTRACT(YEAR FROM dateRelease) BETWEEN ${yearFrom} AND ${yearTo} `;
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

router.get('/video/:imdb', function(req, res) {
    const path = 'data/test.mp4';
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] 
        ? parseInt(parts[1], 10)
        : fileSize-1
      const chunksize = (end-start)+1
      const file = fs.createReadStream(path, {start, end})
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

module.exports = router;