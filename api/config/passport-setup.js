const passport = require("passport");
const keys = require("./keys");
const { findUser, addUser } = require('./../models/auth');
const GithubStrategy = require('passport-github').Strategy;
const SchoolStrategy = require('passport-42').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.serializeUser((userName, done) => {
  console.log(userName);
  done(null, userName);
});

passport.deserializeUser((userName, done) => {
  console.log('des', userName);
  done(null, userName);
});

passport.use(new GithubStrategy({
  clientID: keys.GITHUB_ACCESS_TOKEN,
  clientSecret: keys.GITHUB_TOKEN_SECRET,
  callbackURL: "/api/auth/github/redirect"
},
  async (token, tokenSecret, profile, done) => {
    const userName = profile.username;
    const email = (profile.emails[0].value) ? profile.emails[0].value : '';
    console.log(profile.username, email);

    findUser(userName, 'github')
      .then(data => {
        console.log(data);
        if (!data[0]) {
          addUser(userName, email, 'github')
            .then(data => {
              (data) ? done(null, userName) : done(null, 'Ooopsy! Cannot auth. Try again');
            })
            .catch(() => {
              done(null, 'Ooopsy! Cannot auth. Try again');
            });
        }
        else
          done(null, userName);
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

    findUser(userName, 'school42')
      .then(data => {
        if (!data[0]) {
          addFullUser(userName, email, lastName, firstName, 'school42')
            .then(data => {
              (data) ? done(null, userName) : done(null, 'Ooopsy! Cannot auth. Try again');
            })
            .catch(() => {
              done(null, 'Ooopsy! Cannot auth. Try again');
            });
        }
        else
          done(null, userName);
      })
      .catch(() => {
        done(null, 'Ooopsy! Cannot auth. Try again');
      });
  }
));

passport.use(new LocalStrategy(
  function (username, password, done) {
    findUser(username, 'hypert')
      .then(data => {
        let check;

        if (data[0]) {
          check = bcrypt.compareSync(password, data[0].password);
          return (check) ? done(null, username) : done(null, 'Ooopsy! Cannot auth. Try again');
        }
        else
          return done(null, 'Ooopsy! Cannot auth. Try again');
      })
      .catch(() => {
        return done(null, 'Ooopsy! Cannot auth. Try again');
      });

  }
));