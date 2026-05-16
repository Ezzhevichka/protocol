import passport from "passport";
import SteamStrategy from "passport-steam";
import { prisma } from "@squad-admin/database";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user ?? false);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new SteamStrategy(
    {
      returnURL: `${process.env.BACKEND_URL}/auth/steam/return`,
      realm: process.env.BACKEND_URL!,
      apiKey: process.env.STEAM_API_KEY!,
    },
    async (_identifier, profile, done) => {
      try {
        const steamId = profile.id;
        const avatarUrl = profile.photos?.[2]?.value ?? profile.photos?.[0]?.value ?? null;
        const steamProfile = profile as typeof profile & {
          profileUrl?: string;
          _json?: { profileurl?: string };
        };
        const profileUrl = steamProfile.profileUrl ?? steamProfile._json?.profileurl ?? null;

        const user = await prisma.user.upsert({
          where: { steamId },
          update: {
            displayName: profile.displayName,
            avatarUrl,
            profileUrl,
          },
          create: {
            steamId,
            displayName: profile.displayName,
            avatarUrl,
            profileUrl,
          },
        });

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

export default passport;
