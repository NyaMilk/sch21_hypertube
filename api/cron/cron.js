const { deleteMovies } = require('../models/movies');
const rimraf = require("rimraf");
const CronJob = require('cron').CronJob;

exports.job = new CronJob('* * * 30 * *', () => {
    deleteMovies()
        .then(files => {
            files.forEach(file => {
                let path = file.path.split('/').slice(0, -1).join('/');
                rimraf(path, (err) => { if (err) console.log("Can't delete") });
            })
        })
        .catch(() => console.log("Can't delete"));
}, null, true, 'America/Los_Angeles');
