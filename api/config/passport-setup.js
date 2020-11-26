const passport = require("passport");
const keys = require("./keys");
const GithubStrategy = require('passport-github').Strategy;
const SchoolStrategy = require('passport-42').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

passport.use(new GithubStrategy({
  clientID: keys.GITHUB_ACCESS_TOKEN,
  clientSecret: keys.GITHUB_TOKEN_SECRET,
  callbackURL: "/api/auth/github/redirect"
},
  async (token, tokenSecret, profile, done) => {

    done(null, profile);
  }
));

passport.use(new SchoolStrategy({
  clientID: keys.SCHOOL_ACCESS_TOKEN,
  clientSecret: keys.SCHOOL_TOKEN_SECRET,
  callbackURL: "/api/auth/intra/redirect"
},
  async (token, tokenSecret, profile, done) => {

    done(null, profile);
  }
));