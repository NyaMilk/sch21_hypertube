const FACEBOOK_TOKENS = {
  FACEBOOK_ACCESS_TOKEN: "1022334471601321",
  FACEBOOK_TOKEN_SECRET: "633f5227658662ad19f048cd8c8e22c5"
};

const PORTS = {
  apiPort: "5000"
};

const DB_LOGIN = "";
const DB_PSWD = "";
const DB_NAME = "";

const DB = {
  DB_URL: `postgres://${DB_LOGIN}:${DB_PSWD}@localhost:5432/${DB_NAME}`
}

const SESSION = {
  COOKIE_KEY: "hyperSession"
};

const KEYS = {
  ...FACEBOOK_TOKENS,
  ...SESSION,
  ...PORTS,
  ...DB
};

module.exports = KEYS;