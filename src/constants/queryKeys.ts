/**
 * React Query key constants
 * Centralized query keys for consistent cache management
 */

// Base query keys
export const QUERY_KEYS = {
  // Authentication
  AUTH: {
    USER: ["auth", "user"] as const,
    PROFILE: ["auth", "profile"] as const,
    SESSION: ["auth", "session"] as const,
  },

  // Users
  USERS: {
    ALL: ["users"] as const,
    LIST: (page: number, limit: number) =>
      ["users", "list", page, limit] as const,
    DETAIL: (id: string) => ["users", "detail", id] as const,
    SEARCH: (query: string) => ["users", "search", query] as const,
  },

  // Subscriptions
  SUBSCRIPTIONS: {
    PLANS: ["subscriptions", "plans"] as const,
    USER_CREDITS: ["subscriptions", "credits"] as const,
    PAYMENT_METHODS: ["subscriptions", "payment-methods"] as const,
    TRANSACTIONS: (page: number, limit: number) =>
      ["subscriptions", "transactions", page, limit] as const,
  },

  // Reports
  REPORTS: {
    USER_REPORTS: (page: number, limit: number) =>
      ["reports", "user", page, limit] as const,
    ADMIN_REPORTS: (page: number, limit: number) =>
      ["reports", "admin", page, limit] as const,
    DETAIL: (id: string) => ["reports", "detail", id] as const,
    GENERATE: ["reports", "generate"] as const,
  },

  // Admin
  ADMIN: {
    DASHBOARD: ["admin", "dashboard"] as const,
    ANALYTICS: ["admin", "analytics"] as const,
    USERS: (page: number, limit: number) =>
      ["admin", "users", page, limit] as const,
    INVOICES: (page: number, limit: number) =>
      ["admin", "invoices", page, limit] as const,
    CONTACTS: (page: number, limit: number) =>
      ["admin", "contacts", page, limit] as const,
  },

  // Properties
  PROPERTIES: {
    SEARCH: (address: string) => ["properties", "search", address] as const,
    ANALYSIS: (propertyId: string) =>
      ["properties", "analysis", propertyId] as const,
  },
} as const;

// Query key factories for dynamic keys
export const createQueryKey = {
  userTransactions: (userId: string, page: number, limit: number) =>
    ["users", userId, "transactions", page, limit] as const,

  userReports: (userId: string, page: number, limit: number) =>
    ["users", userId, "reports", page, limit] as const,

  reportsByStatus: (status: string, page: number, limit: number) =>
    ["reports", "status", status, page, limit] as const,

  planSubscribers: (planId: string) =>
    ["subscriptions", "plans", planId, "subscribers"] as const,
};

// Query key helpers
export const getBaseKey = (key: readonly string[]) => key[0];
export const getFeatureKey = (key: readonly string[]) => key.slice(0, 2);
export const getDetailKey = (key: readonly string[]) => key;

// Invalidation helpers
export const invalidateQueries = {
  auth: () => QUERY_KEYS.AUTH,
  users: () => QUERY_KEYS.USERS.ALL,
  subscriptions: () => ["subscriptions"] as const,
  reports: () => ["reports"] as const,
  admin: () => ["admin"] as const,
  properties: () => ["properties"] as const,
} as const;

// Type exports for type safety
export type QueryKey = typeof QUERY_KEYS;
export type AuthQueryKey = typeof QUERY_KEYS.AUTH;
export type UsersQueryKey = typeof QUERY_KEYS.USERS;
export type SubscriptionsQueryKey = typeof QUERY_KEYS.SUBSCRIPTIONS;
export type ReportsQueryKey = typeof QUERY_KEYS.REPORTS;
export type AdminQueryKey = typeof QUERY_KEYS.ADMIN;
export type PropertiesQueryKey = typeof QUERY_KEYS.PROPERTIES;
