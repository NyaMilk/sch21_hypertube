module.exports = function (io) {
    const mySpace = io.of('/socks');
    let movies = new Object();

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    mySpace.on('connection', (socket) => {

        socket.on('log_in', (nickname) => {
            users[nickname] = socket.id;
            setStatus(["Online", nickname])
                .then()
                .catch();
        });

        socket.on('notification', ([imdb, username]) => {
            // (!movies[imdb]) ? movies[imdb] = [] : movies[imdb].push(username);

            if (movies[imdb])
                movies[imdb].push(username);
            else {
                download();
                mySpace.emit('new_notification', movies[imdb]);
            }
        })

        socket.on('disconnect', () => {
            const nickname = getKeyByValue(users, socket.id);

            if (users && nickname)
                setStatus(["Offline", nickname])
                    .then()
                    .catch();
        })
    })

}