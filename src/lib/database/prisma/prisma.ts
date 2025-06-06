import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  errorFormat: "pretty",
});

prisma.$use(async (params: Prisma.MiddlewareParams, next) => {
  console.log("Query:", params);
  return next(params);
});

export default prisma;
