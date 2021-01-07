const router = require('express').Router();
const { getMoviePath, updateMovie } = require('../models/stream');
const fs = require('fs');

router.get('/movie/:imdb/:quality', async (req, res) => {
    try {
        const { imdb, quality } = req.params;
        const dirPath = `${process.cwd()}/movies/${imdb}_${quality}`;
        const dbRes = await getMoviePath(imdb, quality);

        if (!dbRes || !dbRes.path) {
            res.status(200).json({
                success: false,
                msg: "Film not found"
            })
        }
        const path = `${dirPath}/${dbRes.path}`;

        await updateMovie(imdb, quality, new Date());
        const stat = fs.statSync(path, res);
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
    } catch (e) {
        console.log("Smth wrong with stream");
        res.status(200).json({
            success: false,
            msg: e.message
        })
    }
});

router.get('/subtitle/:lang/:imdb', async (req, res) => {
    try {
        const { lang, imdb } = req.params;
        const path = `${process.cwd()}/movies/subtitles/${imdb}_${lang}.srt`;
        const subtitle = fs.readFileSync(path, res);
        // const subtitle = fs.readFileSync(path, 'utf8', res);
        res.send(subtitle);
    } catch (e) {
        console.log("Smth wrong with subtitle");
        res.status(200).json({
            success: false,
            msg: e.message
        })
    }
});

module.exports = router;