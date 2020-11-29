const router = require("express").Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const CLIENT_LOGIN_PAGE_URL = "http://localhost:3000/login";
const parser = require('body-parser');
const urlencodedParser = parser.urlencoded({extended : false});

router.get("/success", (req, res) => {

  // console.log(req);
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
  else
    res.status(200).json({
      success: false
    })
});

router.get("/failed", (req, res) => {
  console.log('1');

  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

router.get("/logout", (req, res) => {
  console.log('1');

  req.logout();
  res.status(200);
  res.json({
    msg: 'res'
  })
  // res.redirect(CLIENT_LOGIN_PAGE_URL);
});

router.get("/github", passport.authenticate("github"));

router.get("/github/redirect",
  passport.authenticate("github", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/api/auth/failed"
  })
);

router.get("/intra", passport.authenticate("42"), function (req, res) {
  console.log('1');

  console.log(req);
});

router.get("/intra/redirect",
  passport.authenticate("42"), (req, res) => {
    console.log('1');

    console.log(req);
    res.redirect(CLIENT_HOME_PAGE_URL);
  }
);

router.post('/test', urlencodedParser,
  passport.authenticate('local'),
  function (req, res) {
    res.redirect(CLIENT_HOME_PAGE_URL);
  })
module.exports = router;