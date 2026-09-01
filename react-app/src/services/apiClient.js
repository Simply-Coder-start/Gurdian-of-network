import { mockApi } from './mockApi';

/**
 * Standard API Client with seamless fallback to Mock Data.
 * Purely read-only; never sends action verbs or active mitigation commands.
 */
export const apiClient = {
  getDashboardSummary: async () => {
    try {
      // In production phase, swap with fetch('/api/v1/dashboard/summary')
      return await mockApi.getDashboardSummary();
    } catch (err) {
      console.warn('Backend unavailable, falling back to mock summary', err);
      return await mockApi.getDashboardSummary();
    }
  },
  getAlerts: async () => {
    try {
      return await mockApi.getAlerts();
    } catch (err) {
      console.warn('Backend unavailable, falling back to mock alerts', err);
      return await mockApi.getAlerts();
    }
  }
};
