CREATE USER super WITH SUPERUSER;
ALTER USER super WITH PASSWORD '1234';
DROP DATABASE IF EXISTS hypertube;
CREATE DATABASE hypertube;