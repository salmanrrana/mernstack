const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  //this user.id is referenceing the user in mongodb and the unique id created my mlab
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  //since we are looking through our models of users we will do User
  User.findById(id).then(user => {
    done(null, user);
  });
});

//new GoogleStrategy creates a new instance of GoogleStrategy. Inside of function we are going to
//pass in some configuration that tells googleStrategy how to authenticate our users.
//inside function will be clientID and clientSecret that will be provided by Google OAuth Service.
//passport.use is like saying passport there is a new strategy available.
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    //this accessToken that we get from Google allows us to make a new user in our database
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        done(null, existingUser);
      } else {
        //we dont have a user record(existingUser is null) with this ID and will now make a new record
        const user = await new User({ googleId: profile.id }).save();
        done(null, user);
      }
    }
  )
);
