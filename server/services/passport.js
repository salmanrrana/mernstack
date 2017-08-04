const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

//new GoogleStrategy creates a new instance of GoogleStrategy. Inside of function we are going to
//pass in some configuration that tells googleStrategy how to authenticate our users.
//inside function will be clientID and clientSecret that will be provided by Google OAuth Service.
//passport.use is like saying passport there is a new strategy available.
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    //this accessToken that we get from Google allows us to make a new user in our database
    (accessToken, refreshToken, profile, done) => {
      //look through user collection and fine one that
      //has that google ID that is currently logging in
      User.findOne({ googleId: profile.id })
      //this existingUser is a model instance
        .then((existingUser) => {
          //this below will say if we already have a record with the given profile ID
          if (existingUser) {
            done(null, existingUser);
          }
          //we dont have a user record(existingUser is null) with this ID and will now make a new record
          else {
            new User({ googleId: profile.id }).save()
              .then(user => done(null, user))
          }
        })


    }
  )
);
