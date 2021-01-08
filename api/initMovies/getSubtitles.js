const fs = require('fs');
const download = require('download')
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS({
    useragent: 'UserAgent',
    username: 'lpan42',
    password: 'Ashley0930',
    ssl: true
});
const { setStatusSubtitle } = require('../models/movies');

exports.getSubtitles = (imdb) => {
    return OpenSubtitles.search({
        sublanguageid: ["eng", "rus"].join(),
        extensions: ['vtt', 'srt'],
        imdbid: imdb,
    }).then(async subs => {
        const path = process.cwd() + '/movies/subtitles/';

        if (subs.en && subs.en.url) {
            try {
                fs.writeFileSync(path + imdb + "_en.srt", await download(subs.en.url));
                await setStatusSubtitle(imdb, 'enSubtitle');
            }
            catch (e) {
                console.log(e.message);
            }
        }
        if (subs.ru && subs.ru.url) {
            try {
                fs.writeFileSync(path + imdb + "_ru.srt", await download(subs.ru.url));
                await setStatusSubtitle(imdb, 'ruSubtitle');
            }
            catch (e) {
                console.log(e.message);
            }
        }
    });
}
