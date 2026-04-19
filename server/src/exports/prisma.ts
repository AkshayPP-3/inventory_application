import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
const { PrismaClient } = require("@prisma/client") as {
	PrismaClient: new (...args: any[]) => any;
};

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });


export { prisma };