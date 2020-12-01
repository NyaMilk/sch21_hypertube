DROP TABLE IF EXISTS Users CASCADE;
DROP TYPE providers CASCADE;

CREATE TYPE providers AS ENUM ('hypert', 'github', 'school42');

CREATE TABLE Users
(
    id SERIAL,
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
    avatar text[2] DEFAULT ARRAY['image/jpg','avatar.jpg'],
    about text DEFAULT 'About me',
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

INSERT INTO Users (userName) VALUES ('test');