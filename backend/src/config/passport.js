import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import userModel from "../models/user.model.js";
import { config } from "./config.js";

/* GOOGLE STRATEGY */
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: `${config.BASE_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const picture = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("Google email not found"), null);
        }

        let user = await userModel.findOne({ email });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            user.picture = user.picture || picture;
            await user.save();
          }
          return done(null, user);
        }
        const baseUsername = profile.displayName
          .replace(/\s+/g, "")
          .toLowerCase();

        let username = baseUsername;

        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
          username = `${baseUsername}_${Date.now()}`;
        }

        if (!user) {
          user = await userModel.create({
            username,
            email,
            provider: "google",
            googleId: profile.id,
            picture,
            verified: true,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

/* GITHUB STRATEGY */
passport.use(
  new GitHubStrategy(
    {
      clientID: config.GITHUB_CLIENT_ID,
      clientSecret: config.GITHUB_CLIENT_SECRET,
      callbackURL: `${config.BASE_URL}/api/auth/github/callback`,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Github email not available"), null);
        }

        const picture = profile.photos?.[0]?.value;
        const name = profile.displayName || profile.username;

        let user = await userModel.findOne({ email });

        if (user) {
          if (!user.githubId) {
            user.githubId = profile.id;
            user.picture = user.picture || picture;
            await user.save();
          }
          return done(null, user);
        }
        const baseUsername = name.replace(/\s+/g, "").toLowerCase();

        let username = baseUsername;

        const existingUser = await userModel.findOne({ username });

        if (existingUser) {
          username = `${baseUsername}_${Date.now()}`;
        }

        if (!user) {
          user = await userModel.create({
            username,
            email,
            provider: "github",
            githubId: profile.id,
            picture,
            verified: true,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

export default passport;
