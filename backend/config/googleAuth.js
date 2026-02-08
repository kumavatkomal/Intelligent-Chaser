import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.js";

export const configureGoogleAuth = (app) => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback";

  if (!clientID || !clientSecret) {
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || "";
          const avatar = profile.photos?.[0]?.value || "";

          let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });

          if (!user) {
            user = await User.create({
              name: profile.displayName || "",
              email,
              googleId: profile.id,
              avatar
            });
          } else {
            user.googleId = profile.id;
            user.avatar = avatar || user.avatar;
            user.name = profile.displayName || user.name;
            await user.save();
          }

          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  app.use(passport.initialize());
};
