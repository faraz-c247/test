/**
 * Error message constants
 * Centralized error messages for consistent user experience
 */

// Authentication errors
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
  EMAIL_INVALID: "Please enter a valid email address",
  LOGIN_FAILED: "Login failed. Please try again.",
  LOGOUT_FAILED: "Failed to logout. Please try again.",
  SESSION_EXPIRED: "Your session has expired. Please login again.",
  UNAUTHORIZED: "You are not authorized to perform this action",
  USER_NOT_FOUND: "User not found",
  REGISTRATION_FAILED: "Registration failed. Please try again.",
  PASSWORD_RESET_FAILED: "Failed to reset password. Please try again.",
} as const;

// Subscription & Payment errors
export const SUBSCRIPTION_ERRORS = {
  PLANS_LOAD_FAILED: "Failed to load subscription plans",
  CREDITS_LOAD_FAILED: "Failed to load user credits",
  PAYMENT_FAILED: "Payment failed. Please try again.",
  PAYMENT_INTENT_FAILED: "Failed to create payment intent",
  PURCHASE_COMPLETION_FAILED:
    "Payment succeeded but failed to add credits. Please contact support.",
  PROMO_CODE_INVALID: "Invalid promo code",
  PROMO_CODE_VALIDATION_FAILED: "Failed to validate promo code",
  PLAN_NOT_FOUND: "Subscription plan not found",
  INSUFFICIENT_CREDITS: "Insufficient credits to generate report",
  REPORT_GENERATION_FAILED: "Failed to generate report",
  REPORT_NOT_FOUND: "Report not found",
} as const;

// Form validation errors
export const FORM_ERRORS = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  INVALID_ADDRESS: "Please enter a valid address",
  PASSWORD_MISMATCH: "Passwords do not match",
  INVALID_DATE: "Please enter a valid date",
  INVALID_NUMBER: "Please enter a valid number",
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be no more than ${max} characters`,
} as const;

// Network & API errors
export const NETWORK_ERRORS = {
  CONNECTION_FAILED:
    "Connection failed. Please check your internet connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  TIMEOUT: "Request timeout. Please try again.",
  NOT_FOUND: "Resource not found",
  FORBIDDEN: "Access forbidden",
  BAD_REQUEST: "Invalid request. Please check your input.",
  RATE_LIMITED: "Too many requests. Please wait and try again.",
} as const;

// General application errors
export const GENERAL_ERRORS = {
  UNEXPECTED_ERROR: "An unexpected error occurred",
  FEATURE_UNAVAILABLE: "This feature is currently unavailable",
  MAINTENANCE_MODE: "System is under maintenance. Please try again later.",
  BROWSER_UNSUPPORTED: "Your browser is not supported",
  JAVASCRIPT_DISABLED: "JavaScript must be enabled to use this application",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  REGISTRATION_SUCCESS: "Registration successful",
  PASSWORD_RESET_SUCCESS: "Password reset link sent to your email",
  PROFILE_UPDATED: "Profile updated successfully",
  PAYMENT_SUCCESS: "Payment completed successfully",
  PURCHASE_SUCCESS: "Purchase completed successfully",
  REPORT_GENERATED: "Report generated successfully",
  PROMO_CODE_APPLIED: "Promo code applied successfully",
  DATA_SAVED: "Data saved successfully",
  EMAIL_SENT: "Email sent successfully",
} as const;

// Loading messages
export const LOADING_MESSAGES = {
  AUTHENTICATING: "Authenticating...",
  LOADING_PLANS: "Loading subscription plans...",
  PROCESSING_PAYMENT: "Processing payment...",
  GENERATING_REPORT: "Generating report...",
  SAVING_DATA: "Saving data...",
  LOADING_DATA: "Loading data...",
  APPLYING_PROMO: "Applying promo code...",
  SENDING_EMAIL: "Sending email...",
} as const;

// Validation helpers
export const getMinLengthError = (field: string, min: number) =>
  `${field} must be at least ${min} characters`;

export const getMaxLengthError = (field: string, max: number) =>
  `${field} must be no more than ${max} characters`;

export const getRequiredFieldError = (field: string) => `${field} is required`;

// Error message types
export type AuthError = (typeof AUTH_ERRORS)[keyof typeof AUTH_ERRORS];
export type SubscriptionError =
  (typeof SUBSCRIPTION_ERRORS)[keyof typeof SUBSCRIPTION_ERRORS];
export type FormError = (typeof FORM_ERRORS)[keyof typeof FORM_ERRORS];
export type NetworkError = (typeof NETWORK_ERRORS)[keyof typeof NETWORK_ERRORS];
export type GeneralError = (typeof GENERAL_ERRORS)[keyof typeof GENERAL_ERRORS];
export type SuccessMessage =
  (typeof SUCCESS_MESSAGES)[keyof typeof SUCCESS_MESSAGES];
export type LoadingMessage =
  (typeof LOADING_MESSAGES)[keyof typeof LOADING_MESSAGES];
