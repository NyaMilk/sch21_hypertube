const fs = require('fs');
const rimraf = require("rimraf");
const subsrt = require('subsrt');
const torrentStream = require('torrent-stream');
const { getMagnet, setMoviePath, setMovieStatus, updateMovieStatus } = require('../models/stream');
const { getSubtitles } = require('../initMovies/getSubtitles');

module.exports = (io) => {

    const mySpace = io.of('/socks');
    let movies = new Object();

    mySpace.on('connection', (socket) => {
        socket.on('movie', async ([imdb, quality, index, username]) => {
            const key = `${imdb}_${quality}`;

            if (!movies[key])
                movies[key] = new Set();

            movies[key].add(username);

            if (movies[key].size === 1) {
                await setMovieStatus(imdb, quality, 'downloading');
                const magnet = await getMagnet(imdb, index + 1);
                getSubtitles(imdb)
                    .then(() => {
                        const languages = ['en', 'ru'];

                        languages.map((item) => {
                            const path = `${process.cwd()}/movies/subtitles/${imdb}_${item}`;
                            const srt = fs.readFileSync(`${path}.srt`, 'utf8');
                            if (srt) {
                                const vtt = subsrt.convert(srt, { format: 'vtt' });
                                fs.writeFileSync(`${path}.vtt`, vtt);
                                rimraf(`${path}.srt`, (err) => { if (err) console.log("Can't delete") });
                            }
                        });
                    })
                    .catch(() => console.log("Can't convert subtitles"));
                const dirPath = `${process.cwd()}/movies/${imdb}_${quality}`;
                const options = {
                    connections: 100,
                    uploads: 10,
                    path: dirPath,
                    verify: true,
                    dht: true,
                    tracker: true
                }

                const engine = torrentStream(magnet.torrents, options);

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
                                setMoviePath(imdb, quality, newPath);
                            } else {
                                file.deselect();
                            }
                        });
                    })
                    .on('download', (index) => {
                        process.stdout.write(`\rEngine downloading chunk (${imdb}_${quality}): [${index}]`);
                    })
                    .on('idle', async () => {
                        await updateMovieStatus(imdb, quality, "downloaded");
                        mySpace.emit('notification', [key, Array.from(movies[key])]);
                        console.log(`\nMovie ${imdb} (${quality}) downloaded`);
                    })
            }
        })

        socket.on('waiters', (imdb) => {
            if (movies[imdb])
                mySpace.emit('wait_list', [imdb, Array.from(movies[imdb])]);
            else
                mySpace.emit('wait_list', [imdb, []]);
        })
    })
}