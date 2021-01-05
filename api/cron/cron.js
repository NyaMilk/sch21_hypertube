const { deleteMovies } = require('../models/movies');
const rimraf = require("rimraf");
const CronJob = require('cron').CronJob;

exports.job = new CronJob('* * * 30 * *', () => {
    deleteMovies()
        .then(files => {
            files.forEach(file => {
                let path = file.path.split('/').slice(0, -1).join('/');
                rimraf(path, function (err) {
                    // console.log(err);
                    if (err) throw err;
                });
            })
        })
        .catch(e => console.log(e.message))
}, null, true, 'America/Los_Angeles');