declare module '@/lib/db' {
  import { PrismaClient } from '@prisma/client';
  const prisma: PrismaClient;
  export { prisma };
}
