const torrentStream = require('torrent-stream');
const { getMagnet, setMoviePath, setMovieStatus } = require('../models/stream');
const { getSubtitles } = require('../initMovies/getSubtitles');

module.exports = (io) => {

    const mySpace = io.of('/socks');
    let movies = new Object();

    getKeyByValue = (object, value) => {
        return Object.keys(object).find(key => object[key] === value);
    }

    mySpace.on('connection', (socket) => {
        console.log('socked', movies);

        // socket.on('log_in', (nickname) => {
        //     users[nickname] = socket.id;
        //     setStatus(["Online", nickname])
        //         .then()
        //         .catch();
        // });

        socket.on('movie', async ([imdb, quality, index, username]) => {
            const key = `${imdb}_${quality}`;

            if (!movies[key])
                movies[key] = new Set();

            movies[key].add(username);

            if (movies[key].size === 1) {
                await setMovieStatus(imdb, quality, 'downloading');
                const magnet = await getMagnet(imdb, index + 1);          
                await getSubtitles(imdb);
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
                            } else {
                                file.deselect();
                            }
                        });
                    })
                    .on('download', (index) => {
                        console.log(`Engine downloading chunk: [${index}]`);
                    })
                    .on('idle', () => {
                        mySpace.emit('notification', [key, Array.from(movies[key])]);
                        setMoviePath(imdb, quality, newPath);
                    })
            }
        })

        socket.on('waiters', (imdb) => {
            if (movies[imdb])
                mySpace.emit('wait_list', [imdb, Array.from(movies[imdb])]);
            else
                mySpace.emit('wait_list', [imdb, []]);
        })

        // socket.on('disconnect', () => {
        //     const nickname = getKeyByValue(users, socket.id);

        //     if (users && nickname)
        //         setStatus(["Offline", nickname])
        //             .then()
        //             .catch();
        // })
    })
}