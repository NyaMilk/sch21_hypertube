const GITHUB_TOKENS = {
  GITHUB_ACCESS_TOKEN: "2b1842aa5dda2d18a976",
  GITHUB_TOKEN_SECRET: "fce5dece09b9154fbfe8fcfe359c1997d2ce7fab"
};

const SCHOOL_TOKENS = {
  SCHOOL_ACCESS_TOKEN: "417753365f4b3474df68b229abfbf59e58600da06cb88e0115ccc458e50d0f9b",
  SCHOOL_TOKEN_SECRET: "d2ba34ff7e29a54ae3a5ed7115e2d0db0a268bcf6d5cf8504507204cf601c1d7"
};

const PORTS = {
  apiPort: "5000",
  socketPort: "5001"
};

const DB_LOGIN = "super";
const DB_PSWD = "1234";
const DB_NAME = "hypertube";

const DB = {
  DB_URL: `postgres://${DB_LOGIN}:${DB_PSWD}@localhost:5432/${DB_NAME}`
}

const SESSION = {
  COOKIE_KEY: "hyperT"
};

const EMAIL = {
  EMAIL: "nom4dew@gmail.com",
  EMAIL_PASS: "12072001Aa!@"
}

const BCRYPT = {
  SALT: "_271kweV77"
}

const KEYS = {
  ...GITHUB_TOKENS,
  ...SCHOOL_TOKENS,
  ...SESSION,
  ...PORTS,
  ...DB,
  ...EMAIL,
  ...BCRYPT
};

module.exports = KEYS;