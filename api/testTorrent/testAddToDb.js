const { insertMovies } = require('./../models/movies');

const mock = { imdb: 'tt2015381',
engTitle: 'Guardians of the Galaxy',
engDescription:
 'Light years from Earth, 26 years after being abducted, Peter Quill finds himself the prime target of a manhunt after discovering an orb wanted by Ronan the Accuser.',
engGenres: [ 'adventure', 'science-fiction', 'action' ],
torrents:
 [ [ '1080p',
     'magnet:?xt=urn:btih:11A2AC68A11634E980F265CB1433C599D017A759&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337' ],
   [ '720p',
     'magnet:?xt=urn:btih:836D2E8C6350E4CE3800E812B60DE53A63FEB027&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=udp://p4p.arenabg.ch:1337&tr=udp://tracker.internetwarriors.net:1337' ] ],
ruTitle: 'Стражи Галактики',
ruDescription:
 `Отважному путешественнику Питеру Квиллу попадает в руки таинственный артефакт, принадлежащий могущественному и безжалостному злодею Ронану, строящему коварные планы 
по захвату Вселенной. Питер оказывается в центре межгалактической охоты, где жертва — он сам. Единственный способ спасти свою жизнь — объединиться с четверкой нелюдимых 
изгоев: воинственным енотом по кличке Ракета, человекоподобным деревом Грутом, смертельно опасной Гаморой и одержимым жаждой мести Драксом, также известным как Разрушитель. Когда Квилл понимает, какой силой обладает украденный артефакт и какую опасность он представляет для вселенной, одиночка пойдет на все, чтобы сплотить случайных союзников для решающей битвы за судьбу галактики.`,
year: '2014-07-30',
runtime: 120,
poster: '/p3iZkP9zhzi0tz8H2PkXGaaIWH8.jpg',
ruGenres: [ 'боевик', 'фантастика', 'приключения' ] }

const mock2 = { ...mock };
mock2.imdb = 'tt528491';
const mock_list = [mock, mock2];
insertMovies(mock_list)
  .then(data => console.log(data))
  .catch(e => console.log(e.message))
// console.log(mock_list);