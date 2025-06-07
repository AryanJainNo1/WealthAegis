import { prisma } from '../lib/db';

export const holdingsService = {
  // Create a new holding
  create: async (userId: string, name: string, type: string, value: number) => {
    return await prisma.holding.create({
      data: {
        userId,
        name,
        type,
        value,
      },
    });
  },

  // Get all holdings for a user
  getAll: async (userId: string) => {
    return await prisma.holding.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Update an existing holding
  update: async (id: string, userId: string, data: { name?: string; type?: string; value?: number }) => {
    return await prisma.holding.update({
      where: {
        id,
        userId,
      },
      data,
    });
  },

  // Delete a holding
  delete: async (id: string, userId: string) => {
    return await prisma.holding.delete({
      where: {
        id,
        userId,
      },
    });
  },
};
