INSERT INTO MoviesLogs (idFilm, quality, status, path) VALUES 
('tt2015381', '720p', 'downloading', 'test1');

select *, ARRAY(select quality, status from MoviesLogs where idFilm = 'tt2015381') AS downloads from Movies where imdb = 'tt2015381';

SELECT *, ARRAY(SELECT (quality, status)::TEXT FROM MoviesLogs WHERE idFilm = 'tt0241527') logs FROM Movies WHERE imdb = 'tt0241527';