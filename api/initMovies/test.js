const torrentStream = require('torrent-stream');

const new_path = 'tt1345836' + '_' + '2160p';
const magnet = 'magnet:?xt=urn:btih:DF1D443FB45E674C0480596F12B501C41F551DC7';

const options = {
    connections: 100,
    uploads: 10,
    path: process.cwd() + '/movies/' + new_path,
    verify: true,
    dht: true,
    tracker: true
}

const engine = torrentStream(magnet, options);
console.log('tt', process.cwd());
engine.on('idle', () => {
    console.log('here', engine.files);
})
