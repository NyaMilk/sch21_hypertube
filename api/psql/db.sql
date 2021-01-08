DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Movies CASCADE;
DROP TABLE IF EXISTS MoviesLogs CASCADE;
DROP TABLE IF EXISTS FavoriteMovies CASCADE;
DROP TABLE IF EXISTS Comments CASCADE;
DROP TABLE IF EXISTS Notifications CASCADE;
DROP TABLE IF EXISTS CommentsLike CASCADE;
DROP TABLE IF EXISTS Friends CASCADE;
DROP TYPE providers CASCADE;

CREATE TYPE providers AS ENUM ('hypert', 'github', 'school42');

CREATE TABLE Users
(
    id SERIAL,
    displayName text NOT NULL,
    userName text NOT NULL,
    firstName text,
    lastName text,
    email text DEFAULT NULL,
    provider providers DEFAULT 'hypert',
    password text,
    confirm boolean DEFAULT FALSE,
    confirmHash text,
    remindHash text,
    remindTime timestamp,
    avatar text[2] DEFAULT ARRAY['image/jpg','1.jpg'],
    about text DEFAULT 'About me',
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)             
);

CREATE TABLE Movies
(
    imdb text NOT NULL,
    rate numeric NOT NULL,
    enTitle text NOT NULL, 
    ruTitle text NOT NULL,
    dateRelease timestamp,
    enPoster text,
    ruPoster text,
    enCountries text[],
    ruCountries text[],
    enTrailer text,
    ruTrailer text,
    enDescription text NOT NULL,
    ruDescription text NOT NULL,
    enGenres text[],
    ruGenres text[],
    runtime integer,
    enSubtitle boolean,
    ruSubtitle boolean,
    torrents text[] NOT NULL,
    PRIMARY KEY (imdb)
);

CREATE TABLE MoviesLogs
(
    idFilm text NOT NULL,
    quality text NOT NULL,
    status text,
    path text,
    lastChange timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idFilm) REFERENCES Movies (imdb),
    PRIMARY KEY (idFilm, quality)
);

CREATE TABLE FavoriteMovies 
(
    idUser int,
    idFilm text,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUser) REFERENCES Users (id),
    FOREIGN KEY (idFilm) REFERENCES Movies (imdb)
);

CREATE TABLE Notifications (
    idUser int,
    idFilm text,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUser) REFERENCES Users (id),
    FOREIGN KEY (idFilm) REFERENCES Movies (imdb)
);

CREATE TABLE Comments (
    id SERIAL,
    idUser int,
    idFilm text,
    comment text,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (idUser) REFERENCES Users (id),
    FOREIGN KEY (idFilm) REFERENCES Movies (imdb)
);

CREATE TABLE CommentsLike (
    idUser int,
    idComment int,
    status text,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUser) REFERENCES Users (id),
    FOREIGN KEY (idComment) REFERENCES Comments (id)
);

CREATE TABLE Friends (
    idFrom int,
    idTo int,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idFrom) REFERENCES Users (id),
    FOREIGN KEY (idTo) REFERENCES Users (id)
);

INSERT INTO Users (displayName, userName, firstName, lastName, email, password, confirm) VALUES
    ('rkina', 'rkina', 'Dima', 'Ng', 'd_ng@mail.ru','$2b$10$8zsNJUoK40BuGO4f2zLcSOtUGlCDahrG55TPAU4onwb9ey4Zd1IZG',  TRUE),
    ('mgrass', 'mgrass', 'nya', 'milk', 'nyamilk@yandex.ru', '$2b$10$8zsNJUoK40BuGO4f2zLcSOtUGlCDahrG55TPAU4onwb9ey4Zd1IZG', TRUE);
