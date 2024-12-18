import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  // const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
  // const adapter = new PrismaNeon(neon);
  // return new PrismaClient({ adapter });
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
