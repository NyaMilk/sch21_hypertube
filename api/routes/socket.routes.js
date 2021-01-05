const torrentStream = require('torrent-stream');
const { getMagnet, setMoviePath, setMovieStatus } = require('../models/stream');

module.exports = function (io) {

    const mySpace = io.of('/socks');
    let movies = new Object();

    function getKeyByValue(object, value) {
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
            const key = imdb + quality;
            console.log('ind', movies);

            if (!movies[key])
                movies[key] = new Set();

            movies[key].add(username);

            if (movies[key].size === 1) {
                await setMovieStatus(imdb, quality, 'downloading');

                // const magnet = getMagnet(imdb, quality);
                // console.log('magnet', magnet);
                // const options = {
                //     connections: 100,
                //     uploads: 10,
                //     path: dirPath,
                //     verify: true,
                //     dht: true,
                //     tracker: true
                // }

                // const engine = torrentStream(magnet, options);

                // engine
                //     .on("ready", () => {
                //         engine.files.forEach(file => {
                //             const extensions = ['.mp4', '.mkv', '.avi', '.ogg'];
                //             const check = (filename, extensions) => {
                //                 let res = false;
                //                 extensions.forEach((item) => {
                //                     res = (filename.includes(item)) ? true : res;
                //                 })

                //                 return res;
                //             }

                //             if (check(file.name, extensions)) {
                //                 file.select();
                //                 newPath = file.path;
                //             } else {
                //                 file.deselect();
                //             }
                //         });
                //     })
                //     .on('download', (index) => {
                //         console.log(`Engine downloading chunk: [${index}]`);
                //         console.log('Engine swarm downloaded : ', engine.swarm.downloaded);
                //     })
                //     .on('idle', () => {
                        mySpace.emit('notification', [key, Array.from(movies[key])]);
                //         console.log('movies downloaded. Go stream');
                //         setMoviePath(imdb, index, newPath);
                //     })
                
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