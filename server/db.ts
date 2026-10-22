import { count, eq, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  User,
  InsertWaitlistEntry,
  users,
  waitlistEntries,
  WaitlistEntry,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];

  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db
    .insert(users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(
  openId: string
): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return result[0];
}

export function normalizeWaitlistContact(input: string) {
  const value = input.trim();
  const email = value.toLowerCase();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { contact: email, contactType: "email" as const };
  }
  const digits = value.replace(/\D/g, "");
  const indianMobile =
    digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  if (/^[6-9]\d{9}$/.test(indianMobile)) {
    return { contact: `+91${indianMobile}`, contactType: "mobile" as const };
  }
  throw new Error(
    "Please enter a valid email address or Indian mobile number."
  );
}

async function getQueuePosition(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  id: number
) {
  const rows = await db
    .select({ total: count() })
    .from(waitlistEntries)
    .where(lte(waitlistEntries.id, id));
  return Number(rows[0]?.total ?? 0);
}

export type WaitlistStatus = {
  id: number;
  queuePosition: number;
  referralCode: string;
  referralLink: string;
  successfulReferrals: number;
  positionsGained: number;
  nextMilestone: { referrals: number; label: string } | null;
};

export async function getWaitlistStats() {
  const db = await getDb();
  if (!db) return { totalCount: 0, available: false };
  const rows = await db.select({ total: count() }).from(waitlistEntries);
  return { totalCount: Number(rows[0]?.total ?? 0), available: true };
}

export async function getWaitlistEntryByContact(contact: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(waitlistEntries)
    .where(eq(waitlistEntries.contact, contact))
    .limit(1);
  return rows[0];
}

export async function getWaitlistEntryByReferralCode(referralCode: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(waitlistEntries)
    .where(eq(waitlistEntries.referralCode, referralCode.toUpperCase()))
    .limit(1);
  return rows[0];
}

export function toWaitlistStatus(
  entry: WaitlistEntry,
  queuePosition: number
): WaitlistStatus {
  const milestone =
    entry.successfulReferrals < 3
      ? { referrals: 3, label: "प्राधान्य early access साठी पात्र व्हा" }
      : entry.successfulReferrals < 7
        ? { referrals: 7, label: "लॉन्चपूर्वी खास अपडेट्स मिळवा" }
        : null;
  return {
    id: entry.id,
    queuePosition,
    referralCode: entry.referralCode,
    referralLink: `/?ref=${encodeURIComponent(entry.referralCode)}`,
    successfulReferrals: entry.successfulReferrals,
    positionsGained: entry.positionsGained,
    nextMilestone: milestone,
  };
}

export async function getWaitlistStatusByEntry(entry: WaitlistEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const queuePosition = await getQueuePosition(db, entry.id);
  return toWaitlistStatus(entry, queuePosition);
}

export async function registerWaitlistEntry({
  contact,
  contactType,
  referredBy,
}: {
  contact: string;
  contactType: "email" | "mobile";
  referredBy?: string;
}) {
  const db = await getDb();
  if (!db)
    throw new Error(
      "The waitlist is temporarily unavailable. Please try again shortly."
    );

  const existing = await getWaitlistEntryByContact(contact);
  if (existing) {
    return {
      isNew: false as const,
      status: await getWaitlistStatusByEntry(existing),
    };
  }

  const referralCode = await createUniqueReferralCode(db);
  const referrer = referredBy
    ? await getWaitlistEntryByReferralCode(referredBy)
    : undefined;
  const insert: InsertWaitlistEntry = {
    contact,
    contactType,
    referralCode,
    referredBy: referrer?.referralCode ?? null,
    successfulReferrals: 0,
    positionsGained: 0,
  };

  await db.insert(waitlistEntries).values(insert);
  const created = await getWaitlistEntryByContact(contact);
  if (!created) throw new Error("Registration could not be completed.");

  if (referrer) {
    await db
      .update(waitlistEntries)
      .set({
        successfulReferrals: sql`${waitlistEntries.successfulReferrals} + 1`,
        positionsGained: sql`${waitlistEntries.positionsGained} + 10`,
      })
      .where(eq(waitlistEntries.id, referrer.id));
  }

  return {
    isNew: true as const,
    status: await getWaitlistStatusByEntry(created),
  };
}

async function createUniqueReferralCode(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>
) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = `AKOLE${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const existing = await db
      .select({ id: waitlistEntries.id })
      .from(waitlistEntries)
      .where(eq(waitlistEntries.referralCode, code))
      .limit(1);
    if (!existing[0]) return code;
  }
  throw new Error("Could not create a referral code. Please try again.");
}
