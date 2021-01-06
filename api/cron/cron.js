const fs = require('fs');
const fsPromises = require('fs').promises;
const { deleteMovies } = require('../models/movies');
const CronJob = require('cron').CronJob;

exports.job = new CronJob('0 0 * * * *', () => {
    deleteMovies()
        .then(files => {
            console.log(files);
            files.forEach(file => {
                let path = file.split('/').splice(-1).join('/');
                console.log(path);

                // fsPromises.rmdir(path);

                // fs.unlink(file, function (err) {
                //     if (err) throw err;
                // });
            })
        })
        .catch(e => console.log(e.message))
}, null, true, 'America/Los_Angeles');
