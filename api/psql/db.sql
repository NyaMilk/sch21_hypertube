DROP TABLE IF EXISTS Users CASCADE;

CREATE TABLE Users
(
    id SERIAL,
    userName text NOT NULL,
    firstName text NOT NULL,
    lastName text NOT NULL,
    email text DEFAULT NULL,
    password text NOT NULL,
    confirm boolean DEFAULT FALSE,
    confirmHash text,
    remindHash text,
    remindTime timestamp,
    photos text,
    about text,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);