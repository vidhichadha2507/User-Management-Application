import { PrismaClient } from "@prisma/client";

/**
 * Global variable to access the Prisma client.
 * @global
 * @var prisma - The Prisma client instance.
 * @type {PrismaClient | undefined}
 */
declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
