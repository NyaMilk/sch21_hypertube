const FACEBOOK_TOKENS = {
  FACEBOOK_ACCESS_TOKEN: "1022334471601321",
  FACEBOOK_TOKEN_SECRET: "633f5227658662ad19f048cd8c8e22c5"
};

//   const DB_USER = "SOME USER";
//   const DB_PASSWORD = "SOME PASSWPORD";
//   const MONGODB = {
//     MONGODB_URI: `mongodb://${DB_USER}:${DB_PASSWORD}@ds<SOME_DOMAIN>.mlab.com:<PORT>/<PROJECT_NAME>`
//   };
const PORTS = {
  apiPort: "5000"
};

const SESSION = {
  COOKIE_KEY: "hyperSession"
};

const KEYS = {
  ...FACEBOOK_TOKENS,
  ...SESSION,
  ...PORTS
};

module.exports = KEYS;