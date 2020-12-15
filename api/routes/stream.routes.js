const router = require('express').Router();
const { addDownload, deleteDownload, getDownload, getPath, updateMovie, getMagnet } = require('../models/stream');
const torrentStream = require('torrent-stream');
const fs = require('fs');

router.get('/movie/:imdb/:quality', async (req, res) => {
    try {
        const stream = (path, res) => {
            const fullPath = `${path.substr(-4,4)}/${path}`; 

            const stat = fs.statSync(fullPath, res);
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
        }
        const { imdb, quality } = req.params;
        const dirPath = `${process.cwd()}/movies/${imdb}_${quality}`;
        const path = await getPath(imdb, quality);
        if (!path) {
            let newPath;
            const magnet = await getMagnet(imdb, quality);
            console.log('magnet', magnet);
            const dirPath = `${process.cwd()}/movies/${imdb}_${quality}`;
            const options = {
                connections: 100,
                uploads: 10,
                path: dirPath,
                verify: true,
                dht: true,
                tracker: true
            }
            console.log('path', dirPath);
            const engine = torrentStream(magnet, options);

            engine
                .on("ready", () => {
                    engine.files.forEach(file => {
                        const extensions = ['.mp4', '.mkv', '.avi', '.ogg'];
                        const check = (filename, extensions) => {
                            let res = false;
                            extensions.forEach((item) => {
                                res = (filename.includes(item)) ? true : res;
                            })

                            return res;
                        }

                        if (check(file.name, extensions)) {
                            file.select();
                            newPath = file.path;
                        } else {
                            file.deselect();
                        }
                    });
                })
                .on('download', (index) => {
                    console.log(`Engine downloading chunk: [${index}]`);
                    console.log('Engine swarm downloaded : ', engine.swarm.downloaded);
                })
                .on('idle', () => {
                    console.log('movies downloaded. Go stream');
                    addDownload(quality, newPath, imdb)
                        .then(() => {
                            stream(newPath, res);
                        })  
                        .catch(e => {
                            res.status(200).json({
                                msg: e.message
                            })
                        })
                })

        }
        else {
            await updateMovie(imdb, quality);
            stream(path, res);
        }
    } catch (e) {
        console.log(e.message);
        res.status(200).json({
            msg: e.message
        })
    }
});

router.get('/test', async (req, res) => {
    addDownload('720', 'test', 'tt1345836')
        .then(data => {
            console.log(data);
            res.status(200).json({
                msg: data
            })
        })
        .catch((e) => {
            console.log(e.message);
            res.status(200).json({
                msg: e.message
            })
        })
})

router.get('/dd', async (req, res) => {
    try {
        // const path = await updateMovie('tt1345836', '480');
        const path = await getMagnet('tt1345836', '2160p');
        const tmp = path;
        const new_path = 'tt1345836' + '_' + '2160p';
        const magnet = 'magnet:?xt=urn:btih:2A9CA4BCD1F317A629D7D12263E6DDF75AC32AED';

        const options = {
            connections: 100,
            uploads: 10,
            path: process.cwd() + '/movies/' + new_path,
            verify: true,
            dht: true,
            tracker: true
        }

        const engine = torrentStream(magnet, options);
        console.log('tt');
        engine.on('ready', function () {
            engine.files.forEach(function (file) {
                console.log('filename:', file.name);
                var stream = file.createReadStream();
                // stream is readable stream to containing the file content
            });
        });
        // var stream = file.createReadStream();
        // stream is readable stream to containing the file content
        // });
        // engine
        //     .on('ready', () => {
        //         console.log('124');
        //     })
        //     .on('idle', () => {
        //         console.log("Download complete!");
        //         console.log(tmp);
        //         res.status(200).json({
        //             msg: tmp
        //         })
        //     })

        // const check2 = await checkMovie('tt3183660', '720');
    } catch (e) {
        console.log(e.message);
    }

})

module.exports = router;