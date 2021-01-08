const passport = require("passport");
const keys = require("./keys");
const { findUserOauth, findUserLocalAuth, addUser, findUserInAllProviders } = require('./../models/auth');
const GithubStrategy = require('passport-github').Strategy;
const SchoolStrategy = require('passport-42').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.serializeUser((displayName, done) => {
  done(null, displayName);
});

passport.deserializeUser((displayName, done) => {
  findUserInAllProviders(displayName)
    .then(data => {
      (data.length > 0) ? done(null, displayName) : done(null, false);
    })
});

passport.use(new GithubStrategy({
  clientID: keys.GITHUB_ACCESS_TOKEN,
  clientSecret: keys.GITHUB_TOKEN_SECRET,
  callbackURL: "/api/auth/github/redirect"
},
  async (token, tokenSecret, profile, done) => {
    const userName = profile.username;
    const email = (profile.emails[0].value) ? profile.emails[0].value : '';

    findUserOauth(userName, 'github')
      .then(data => {
        if (data.length > 0) 
          done(null, data[0].displayname);
        else {
          addUser(userName, email, 'github')
            .then(data => {
              (data) ? done(null, userName) : done(null, 'Ooopsy! Cannot auth. Try again');
            })
            .catch(() => {
              done(null, 'Ooopsy! Cannot auth. Try again');
            });
        }
      })
      .catch(() => {
        done(null, 'Ooopsy! Cannot auth. Try again');
      });
  }
));

passport.use(new SchoolStrategy({
  clientID: keys.SCHOOL_ACCESS_TOKEN,
  clientSecret: keys.SCHOOL_TOKEN_SECRET,
  callbackURL: "/api/auth/intra/redirect"
},
  async (token, tokenSecret, profile, done) => {
    const userName = profile.username;
    const email = (profile.emails[0].value) ? profile.emails[0].value : '';
    const lastName = profile.name.familyName;
    const firstName = profile.name.firstName;

    findUserOauth(userName, 'school42')
      .then(data => {
        (!data[0]) ? done(null, 'Ooopsy! Cannot auth. Try again') : done(null, data[0].displayname);
      })
      .catch(() => {
        done(null, 'Ooopsy! Cannot auth. Try again');
      });
  }
));

passport.use(new LocalStrategy(
  function (displayname, password, done) {
    findUserLocalAuth(displayname, 'hypert')
      .then(data => {
        let check;

        if (data[0]) {
          check = bcrypt.compareSync(password, data[0].password);
          return (check) ? done(null, displayname) : done(null, 'Ooopsy! Cannot auth. Try again');
        }
        else
          return done(null, 'Ooopsy! Cannot auth. Try again');
      })
      .catch((e) => {
        return done(null, 'Ooopsy! Cannot auth. Try again');
      });

  }
));