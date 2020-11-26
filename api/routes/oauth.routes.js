const router = require("express").Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000/login";

router.get("/success", (req, res) => {
  console.log('1t1t', req);
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
});

router.get("/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

router.get("/logout", (req, res) => {
  console.log('here12');
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});

router.get("/github", passport.authenticate("github"), function(req, res){
  console.log('here');
  res.redirect(CLIENT_HOME_PAGE_URL);
});

router.get("/github/redirect",
  passport.authenticate("github", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/login/failed"
  })
);

router.get("/intra", passport.authenticate("42"));

router.get("/intra/redirect",
  passport.authenticate("42"), (req, res) => {
    console.log("facebook success");
    res.status(200);
    res.redirect(CLIENT_HOME_PAGE_URL);
  }
);

module.exports = router;