const passport = require("passport");
const keys = require("./keys");
const FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

passport.use(new FacebookStrategy({
  clientID: keys.FACEBOOK_ACCESS_TOKEN,
  clientSecret: keys.FACEBOOK_TOKEN_SECRET,
  callbackURL: "/api/login/facebook/redirect"
},
  async (token, tokenSecret, profile, done) => {

    console.log(profile);
    // const currentUser = profile._json.id_str;

    done(null, profile);
  }
));