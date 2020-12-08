const fs = require('fs');
const file = fs.readFileSync('./data/title.ratings.tsv', "utf8");

const tsvJSON = (tsv) => {
  const lines = tsv.split('\n');
  const headers = lines.shift().split('\t');
  return lines.map(line => {
    const data = line.split('\t');
    return headers.reduce((obj, nextKey, index) => {
      obj[nextKey] = data[index];
      return obj;
    }, {});
  });
}

const tsv = tsvJSON(file);

exports.getRate = (imdb) => {
  const res = tsv.filter((item) => {
    return item.tconst === imdb;
  })

  if (res.length > 0)
    return res[0].averageRating
  return null;
}
