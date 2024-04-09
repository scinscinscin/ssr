import { User } from "@prisma/client";
import { generateHashingFunction } from "./lib/generateHashingFunction.js";
import { generateJWTAuth } from "./lib/generateJWTAuth.js";
import { generateSaltFunction } from "./lib/generateSaltFunction.js";
import { db } from "./prisma.js";

export const hashPassword = generateHashingFunction({});
export const createSalt = generateSaltFunction();
export const JwtAuth = generateJWTAuth<{ uuid: string }, User>({
  cookieName: "ssr-template-auth",
  jwtKey: process.env.JWT_KEY!,

  getUserFromPayload: async ({ uuid }) => {
    const user = await db.user.findUnique({ where: { uuid } });
    if (!user) throw new Error("Was not able to find a user with that uuid");
    return user;
  },

  getCookieOptions: () => ({
    maxAge: 1000 * 60 * 60 * 24 * 7,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  }),
});
