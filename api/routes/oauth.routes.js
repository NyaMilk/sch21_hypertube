const router = require("express").Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000/catalog";
const CLIENT_LOGIN_PAGE_URL = "http://localhost:3000/login";
const parser = require('body-parser');
const urlencodedParser = parser.urlencoded({ extended: false });

router.get("/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
  else {
    res.status(200).json({
      success: false,
      message: "user failed to authenticate.2"
    })
  }
});

router.get("/failed", (req, res) => {
  res.status(200).json({
    success: false,
    message: "user failed to authenticate.3"
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).json({
    success: true
  })
});

router.get("/github", passport.authenticate("github"));

router.get("/github/redirect",
  passport.authenticate("github", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: CLIENT_LOGIN_PAGE_URL
  })
);

router.get("/intra", passport.authenticate("42"));

router.get("/intra/redirect",
  passport.authenticate("42", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: CLIENT_LOGIN_PAGE_URL
  })
);

router.post('/local', urlencodedParser,
  passport.authenticate('local', {
    successRedirect: "http://localhost:5000/api/auth/success",
    failureRedirect: "http://localhost:5000/api/auth/failed"
  })
);

<<<<<<< HEAD
router.get("/github", passport.authenticate("github"), function(req, res){
  res.redirect(CLIENT_HOME_PAGE_URL);
});

router.get("/github/redirect",
  passport.authenticate("github", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/login/failed"
  })
);

router.get("/intra", passport.authenticate("42"), function(req, res){
  res.redirect(CLIENT_HOME_PAGE_URL);
});

router.get("/intra/redirect",
  passport.authenticate("42", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/login/failed"
  })
);

module.exports = router;
=======
module.exports = router;
>>>>>>> rkina
