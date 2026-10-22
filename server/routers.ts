import { z } from "zod";
import {
  normalizeWaitlistMobile,
  getWaitlistEntryByReferralCode,
  getWaitlistStats,
  getWaitlistStatusByEntry,
  registerWaitlistEntry,
} from "./db";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";

const nameSchema = z
  .string()
  .trim()
  .min(2, "कृपया तुमचे नाव टाका.")
  .max(120, "नाव 120 अक्षरांपेक्षा मोठे असू नये.")
  .regex(/^[\p{L}][\p{L}\s.'-]*$/u, "कृपया valid नाव टाका.");
const mobileSchema = z
  .string()
  .trim()
  .min(10, "कृपया mobile number टाका.")
  .max(20, "कृपया valid mobile number टाका.");

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  waitlist: router({
    stats: publicProcedure.query(() => getWaitlistStats()),
    register: publicProcedure
      .input(
        z.object({
          name: nameSchema,
          mobile: mobileSchema,
          referralCode: z
            .string()
            .trim()
            .max(16)
            .regex(/^[a-z0-9]+$/i, "Invalid referral code.")
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const normalized = normalizeWaitlistMobile(input.mobile);
          const result = await registerWaitlistEntry({
            name: input.name.trim(),
            ...normalized,
            referredBy: input.referralCode?.toUpperCase(),
          });
          return result;
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Registration could not be completed.";
          throw new TRPCError({ code: "BAD_REQUEST", message });
        }
      }),
    status: publicProcedure
      .input(z.object({ referralCode: z.string().trim().min(5).max(16) }))
      .query(async ({ input }) => {
        const entry = await getWaitlistEntryByReferralCode(input.referralCode);
        if (!entry) return null;
        return getWaitlistStatusByEntry(entry);
      }),
  }),
});

export type AppRouter = typeof appRouter;
