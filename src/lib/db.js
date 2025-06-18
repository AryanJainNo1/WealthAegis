// This file is no longer needed since we're using API service instead
// All database operations should be handled through the API service
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
