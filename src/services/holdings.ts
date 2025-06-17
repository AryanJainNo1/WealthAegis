import api from '../lib/api';

export const holdingsService = {
  // Create a new holding
  create: async (userId: string, name: string, type: string, value: number) => {
    return await api.post('/holdings', { userId, name, type, value });
  },

  // Get all holdings for a user
  getAll: async (userId: string) => {
    return await api.get(`/holdings?userId=${userId}`);
  },

  // Update an existing holding
  update: async (id: string, userId: string, data: { name?: string; type?: string; value?: number }) => {
    return await api.patch(`/holdings/${id}`, { ...data, userId });
  },

  // Delete a holding
  delete: async (id: string, userId: string) => {
    return await api.delete(`/holdings/${id}?userId=${userId}`);
  },
};

// Add type definitions
export type Holding = {
  id: string;
  userId: string;
  name: string;
  type: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
};
