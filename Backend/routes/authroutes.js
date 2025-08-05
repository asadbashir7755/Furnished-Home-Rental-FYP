const express = require("express");
const passport = require("passport");
const { generateTokens } = require("../utils/generatetoken");

const router = express.Router();

router.get("/google", (req, res, next) => {
  console.log("Initiating Google authentication");
  next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("Google callback route hit");
    next();
  },
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      const { user } = req.user; // Extract user from req.user
      const { accessToken, refreshToken } = generateTokens(user._id);

      // Set HTTP-only cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      // Redirect to home page
    //   res.redirect("/");
    res.redirect(`${process.env.CLIENT_URL}/`);

    } catch (error) {
      console.error("Google login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// router.get("/logout", (req, res) => {
//   console.log("Logging out user");
//   req.logout(() => {
//     res.redirect(process.env.CLIENT_URL);
//   });
// });

// router.get("/user", (req, res) => {
//   console.log("Fetching user data");
//   res.json(req.user || null);
// });

module.exports = router;

