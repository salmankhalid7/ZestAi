const express = require("express");
const generateToken = require("../utils/generateToken");
const passport = require("passport");
const router = express.Router();

// 1. Initiate Google Login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// 2. Google Callback (Handles the logic after Google authenticates the user)
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false, // Set to false if you are strictly using JWTs
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req, res) => {
    // 1. Successful authentication, the user is now in req.user
    const token = generateToken(req.user._id);

res.redirect(
  `${process.env.FRONTEND_URL}/auth/success?token=${token}`
);  }
);

router.get("/logout", (req, res) => {

  req.logout(() => {

    req.session.destroy(() => {

      res.clearCookie("connect.sid");

      res.redirect("http://localhost:5173/login");
    });
  });
});

module.exports = router;