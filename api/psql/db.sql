DROP TABLE IF EXISTS Users CASCADE;
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
    id SERIAL,
    imdb text NOT NULL,
    enTitle text NOT NULL,
    ruTitle text NOT NULL,
    year timestamp,
    engDescription text NOT NULL,
    ruDescription text NOT NULL,
    poster text NOT NULL,
    engGenres text[],
    ruGenres text[],
    runtime integer,
    subtitles text,
    torrents text[] NOT NULL,
    isDownloaded boolean DEFAULT FALSE,
    path text
);

INSERT INTO Users (displayName, userName, firstName, lastName, email, password, confirm) VALUES
    ('rkina', 'rkina', 'Dima', 'Ng', 'd_ng@mail.ru','$2b$10$8zsNJUoK40BuGO4f2zLcSOtUGlCDahrG55TPAU4onwb9ey4Zd1IZG',  TRUE),
    ('mgrass', 'mgrass', 'nya', 'milk', 'nyamilk@yandex.ru', '$2b$10$8zsNJUoK40BuGO4f2zLcSOtUGlCDahrG55TPAU4onwb9ey4Zd1IZG', TRUE);

INSERT INTO Movies (imdb, engTitle, year, engDescription, engGenres, runtime) VALUES
    ('7.5', 'Film', '2015-05-06', 'This is test is test is test is test is test', ARRAY['drama'], 555),
    ('9.5', 'Film2', '2017-05-06', 'This is test is test is test is test is test', ARRAY['drama'], 245),
    ('8.5', 'Film3', '2019-05-06', 'This is test is test is test is test is test', ARRAY['horror'], 585),
    ('7.7', 'Film4', '2018-03-07', 'This is test is test is test is test is test', ARRAY['horror'], 455),
    ('6.3', 'Film5', '2018-05-06', 'This is test is test is test is test is test', ARRAY['drama'], 753),
    ('5.5', 'Film6', '2011-02-07', 'This is test is test is test is test is test', ARRAY['drama'], 855),
    ('7.6', 'Film7', '2005-05-06', 'This is test is test is test is test is test', ARRAY['horror'], 955),
    ('7.5', 'Film8', '2015-01-05', 'This is test is test is test is test is test', ARRAY['drama'], 55),
    ('7', 'Film9', '2018-05-06', 'This is test is test is test is test is test', ARRAY['drama'], 552),
    ('1.5', 'Film10', '2015-08-07', 'This is test is test is test is test is test', ARRAY['drama'], 555);
