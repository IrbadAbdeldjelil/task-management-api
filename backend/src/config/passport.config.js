// passport.config.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models/relation.model.js');

passport.use(new GoogleStrategy(
  {
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google callback called');
      let user = await User.findOne({ where: { googleId: profile.id } });
      
      if (!user) {
        user = await User.findOne({ where: { email: profile.emails[0].value } });
      }
      
      if (user && !user.googleId) {
        user.googleId = profile.id;
        user.avatar = profile.photos[0].value;
        await user.save();
      }
      
      if (!user) {
        user = await User.create({
          username: profile.displayName,
          email: profile.emails?.[0]?.value,
          avatar: profile.photos?.[0]?.value || null,
          googleId: profile.id,
          is_verified: true
        });
      }
      
      return done(null, user);
    } catch (err) {
      console.log("passport callback ERROR", err);
      return done(err, null);
    }
  }
));
