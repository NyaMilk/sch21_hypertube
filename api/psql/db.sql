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
    title text NOT NULL,
    year integer,
    description text NOT NULL,
    poster text,
    genres text[],
    runtime integer,
    subtitles text,
    torrents text[],
    isDownloaded boolean,
    path text
);

INSERT INTO Users (displayName, userName, firstName, lastName, email, password, confirm) VALUES
    ('rkina', 'rkina', 'Dima', 'Ng', 'd_ng@mail.ru','$2b$10$8zsNJUoK40BuGO4f2zLcSOtUGlCDahrG55TPAU4onwb9ey4Zd1IZG' ,  TRUE),
    ('mgrass', 'mgrass', 'nya', 'milk', 'nyamilk@yandex.ru', '$2b$10$8zsNJUoK40BuGO4f2zLcSOtUGlCDahrG55TPAU4onwb9ey4Zd1IZG' , TRUE);