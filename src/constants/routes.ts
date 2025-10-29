/**
 * Application route constants
 * Centralized route definitions to avoid magic strings
 */

// Public routes
export const PUBLIC_ROUTES = {
  HOME: "/",
  ABOUT: "/about-us",
  CONTACT: "/contact-us",
  PRIVACY: "/privacy-policy",
} as const;

// Authentication routes
export const AUTH_ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  RESET_PASSWORD: "/reset-password",
} as const;

// User dashboard routes
export const USER_ROUTES = {
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  MY_CREDITS: "/my-credits",
  MY_REPORTS: "/my-reports",
  GENERATE_REPORT: "/generate-report",
  GET_REPORT: "/get-report",
  PURCHASE_PLANS: "/purchase-plans",
  PAYMENT_METHODS: "/payment-methods",
} as const;

// Admin routes
export const ADMIN_ROUTES = {
  DASHBOARD: "/admin/dashboard",
  ANALYTICS: "/admin/analytics",
  USER_MANAGEMENT: "/admin/user-management",
  REPORTS: "/admin/reports",
  INVOICES: "/admin/invoices",
  CONTACTS: "/admin/contacts",
  SETTINGS: "/admin/settings",
} as const;

// API routes
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    PROFILE: "/auth/me",
    REFRESH: "/auth/refresh",
  },
  SUBSCRIPTION: {
    PLANS: "/subscription/plans",
    CREDITS: "/subscription/credits",
    CREATE_PAYMENT_INTENT: "/subscription/create-payment-intent",
    COMPLETE_PURCHASE: "/subscription/complete-purchase",
    VALIDATE_PROMO: "/subscription/validate-promo-code",
    TRANSACTIONS: "/subscription/transactions",
    REPORTS: "/subscription/reports",
  },
  CONTACT: "/contact",
} as const;

// Route helpers
export const getReportRoute = (reportId: string) => `/my-reports/${reportId}`;
export const getAdminReportRoute = (reportId: string) =>
  `/admin/reports/${reportId}`;
export const getUserRoute = (userId: string) =>
  `/admin/user-management/${userId}`;

// Route type definitions
export type PublicRoute = (typeof PUBLIC_ROUTES)[keyof typeof PUBLIC_ROUTES];
export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
export type UserRoute = (typeof USER_ROUTES)[keyof typeof USER_ROUTES];
export type AdminRoute = (typeof ADMIN_ROUTES)[keyof typeof ADMIN_ROUTES];
export type AnyRoute = PublicRoute | AuthRoute | UserRoute | AdminRoute;
