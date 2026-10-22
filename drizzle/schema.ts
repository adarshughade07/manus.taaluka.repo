import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/** Core user table backing the supplied auth flow. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/** One durable, unique waitlist record per normalized email or mobile number. */
export const waitlistEntries = mysqlTable("waitlistEntries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }),
  contact: varchar("contact", { length: 320 }).notNull().unique(),
  contactType: mysqlEnum("contactType", ["email", "mobile"]).notNull(),
  referralCode: varchar("referralCode", { length: 16 }).notNull().unique(),
  referredBy: varchar("referredBy", { length: 16 }),
  successfulReferrals: int("successfulReferrals").default(0).notNull(),
  positionsGained: int("positionsGained").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type WaitlistEntry = typeof waitlistEntries.$inferSelect;
export type InsertWaitlistEntry = typeof waitlistEntries.$inferInsert;
