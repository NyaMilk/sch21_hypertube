const fs = require('fs');
const rimraf = require("rimraf");
const subsrt = require('subsrt');
const { getSubtitles } = require('./getSubtitles');

const test = () => {
    const imdb = "tt0080684";
    getSubtitles(imdb)
        .then(() => {
            const languages = ['en', 'ru'];

            languages.map((item) => {
                const path = `${process.cwd()}/movies/subtitles/${imdb}_${item}`;
                const srt = fs.readFileSync(`${path}.srt`, 'utf8');
                if (srt) {
                    const vtt = subsrt.convert(srt, { format: 'vtt' });
                    fs.writeFileSync(`${path}.vtt`, vtt);
                    rimraf(`${path}.srt`, (err) => { if (err) console.log(err.message) });
                }
            });
        })
        .catch((e) => console.log(e.message));
}

test();
