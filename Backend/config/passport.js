const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user"); // Import your User model
const { generateTokens } = require("../utils/generatetoken"); // Import the generateTokens function
const dotenv = require("dotenv");

dotenv.config(); // Ensure this is called to load environment variables

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback", // Ensure this matches the URL in your Google Developer Console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile:", profile);
        let user = await User.findOne({ googleId: profile.id });
        console.log("User found:", user);

        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            isVerified: true, // Set isVerified to true for new users
            authProvider: "google" // Set authProvider to google
          });
          await user.save();
          console.log("New user created:", user);
        } else {
          // Update existing user to set isVerified to true
          if (!user.isVerified) {
            user.isVerified = true;
            user.authProvider = "google"; // Update authProvider to google
            await user.save();
            console.log("User updated:", user);
          }
        }

        const tokens = generateTokens(user._id);
        console.log("Tokens generated:", tokens);

        return done(null, { user, tokens });
      } catch (error) {
        console.error("Error in Google strategy:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("Deserializing user:", user);
  done(null, user);
});