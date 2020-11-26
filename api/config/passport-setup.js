const passport = require("passport");
const keys = require("./keys");
const GithubStrategy = require('passport-github').Strategy;
const SchoolStrategy = require('passport-42').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

passport.use(new GithubStrategy({
  clientID: keys.GITHUB_ACCESS_TOKEN,
  clientSecret: keys.GITHUB_TOKEN_SECRET,
  callbackURL: "/api/login/github/redirect"
},
  async (token, tokenSecret, profile, done) => {

    // console.log(profile);
    // const currentUser = profile._json.id_str;

    done(null, profile);
  }
));

passport.use(new SchoolStrategy({
  clientID: keys.SCHOOL_ACCESS_TOKEN,
  clientSecret: keys.SCHOOL_TOKEN_SECRET,
  callbackURL: "/api/login/intra/redirect"
},
  async (token, tokenSecret, profile, done) => {
    // console.log('here', token, tokenSecret, profile, done);

    // console.log(profile);
    // const currentUser = profile._json.id_str;

    done(null, profile);
  }
));