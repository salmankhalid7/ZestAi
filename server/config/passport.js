const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User");


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },

    async (accessToken, refreshToken, profile, done) => {

      try {

        let user = await User.findOne({
          googleId: profile.id
        });

        if (!user) {

          user = await User.create({
            name: profile.displayName,

            email: profile.emails[0].value,

            googleId: profile.id,

            avatar: profile.photos[0].value,

            authProvider: "google"
          });
          console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
          console.log("CALLBACK URL:", process.env.GOOGLE_CALLBACK_URL);
        }

        return done(null, user);

      } catch (error) {

        return done(error, null);
      }
    }
  )
);


// FIX FOR SESSION ERROR
passport.serializeUser((user, done) => {
  done(null, user.id);
});


passport.deserializeUser(async (id, done) => {

  try {

    const user = await User.findById(id);

    done(null, user);

  } catch (error) {

    done(error, null);
  }
});