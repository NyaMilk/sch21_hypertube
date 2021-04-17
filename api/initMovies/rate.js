const fs = require('fs');
const file = fs.readFileSync('./data/title.ratings.tsv', "utf8");
const file2 = fs.readFileSync('./data/iso.csv', "utf8");

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

const csvJSON = (csv) => {
  const lines = csv.split('\r\n');
  const headers = lines.shift().split(',');
  return lines.map(line => {
    const data = line.split(',');
    return headers.reduce((obj, nextKey, index) => {
      obj[nextKey] = data[index];
      return obj;
    }, {});
  });
}

const tsv = tsvJSON(file);
const csv = csvJSON(file2);

exports.getRate = (imdb) => {
  const res = tsv.filter((item) => {
    return item.tconst === imdb;
  })

  if (res.length > 0)
    return res[0].averageRating
  return null;
}

exports.getRuIso = (iso) => {
  const res = csv.filter((item) => {
    return item['code'] === iso;
  })

  if (res.length > 0) {
    return res[0]['﻿country'];
  }
  return null;
}
