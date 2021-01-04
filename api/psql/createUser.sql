CREATE USER super WITH SUPERUSER;
ALTER USER super WITH PASSWORD '1234';
DROP DATABASE IF EXISTS hypertube;
CREATE DATABASE hypertube;
SELECT displayName, firstName, lastName, email, about, avatar, provider,
    (SELECT CASE WHEN EXISTS
    (SELECT 1 FROM Friends
    WHERE idFrom = (SELECT id FROM Users WHERE displayName='mgrass')
    AND idTo = (SELECT id FROM Users WHERE displayName='rkina'))
    THEN 1 ELSE 0 END)
    FROM Users WHERE displayName='rkina';