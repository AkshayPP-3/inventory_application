import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { prisma } from "../lib/prisma";
import { signToken } from "../utils/jwt";

/* GOOGLE */
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/api/auth/google/callback",
  },
  async (_a, _b, profile, done) => {
    const email = profile.emails?.[0]?.value!;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { email, provider: "google" },
      });
    }

    done(null, { token: signToken(user.id) });
  }
));

/* GITHUB */
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: "/api/auth/github/callback",
  },
  async (_a: any, _b: any, profile: { emails: { value: string; }[]; username: any; }, done: (arg0: null, arg1: { token: string; }) => void) => {
    const email =
      profile.emails?.[0]?.value ||
      `${profile.username}@github.com`;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { email, provider: "github" },
      });
    }

    done(null, { token: signToken(user.id) });
  }
));

export default passport;