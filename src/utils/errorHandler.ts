/**
 * Centralized error handling utility
 * Provides consistent error processing and user feedback
 */

import { toast } from "react-hot-toast";
import {
  AUTH_ERRORS,
  NETWORK_ERRORS,
  GENERAL_ERRORS,
} from "@/constants/errorMessages";

// Error types
interface ApiError extends Error {
  status?: number;
  code?: string;
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
  };
}

interface ErrorContext {
  action?: string;
  component?: string;
  userId?: string;
  additionalData?: Record<string, unknown>;
}

// Error severity levels
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Error handling result
interface ErrorHandlingResult {
  shouldRetry: boolean;
  userMessage: string;
  shouldRedirect?: string;
  shouldReload?: boolean;
}

/**
 * Centralized error handler
 */
export class ErrorHandler {
  private static logError(
    error: Error,
    context?: ErrorContext,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): void {
    const errorLog = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString(),
      context,
      severity,
      url: typeof window !== "undefined" ? window.location.href : "SSR",
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : "SSR",
    };

    // In production, send to error monitoring service (e.g., Sentry)
    if (process.env.NODE_ENV === "production") {
      // TODO: Integrate with error monitoring service
      console.error("Production Error:", errorLog);
    } else {
      console.error("Error Details:", errorLog);
    }
  }

  /**
   * Handle API errors with appropriate user feedback
   */
  static handleApiError(
    error: ApiError,
    context?: ErrorContext,
    showToast: boolean = true
  ): ErrorHandlingResult {
    const result: ErrorHandlingResult = {
      shouldRetry: false,
      userMessage: GENERAL_ERRORS.UNEXPECTED_ERROR,
    };

    // Extract status code
    const status = error.status || error.response?.status;

    // Log the error
    this.logError(error, context, this.getErrorSeverity(status));

    // Handle specific status codes
    switch (status) {
      case 400:
        result.userMessage =
          error.response?.data?.message || NETWORK_ERRORS.BAD_REQUEST;
        break;

      case 401:
        result.userMessage = AUTH_ERRORS.UNAUTHORIZED;
        result.shouldRedirect = "/login";
        break;

      case 403:
        result.userMessage = NETWORK_ERRORS.FORBIDDEN;
        break;

      case 404:
        result.userMessage = NETWORK_ERRORS.NOT_FOUND;
        break;

      case 422:
        // Validation errors
        if (error.response?.data?.errors) {
          const validationErrors = error.response.data.errors;
          const firstError = Object.values(validationErrors)[0]?.[0];
          result.userMessage = firstError || NETWORK_ERRORS.BAD_REQUEST;
        } else {
          result.userMessage =
            error.response?.data?.message || NETWORK_ERRORS.BAD_REQUEST;
        }
        break;

      case 429:
        result.userMessage = NETWORK_ERRORS.RATE_LIMITED;
        result.shouldRetry = true;
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        result.userMessage = NETWORK_ERRORS.SERVER_ERROR;
        result.shouldRetry = true;
        break;

      default:
        // Network errors
        if (error.message.includes("timeout")) {
          result.userMessage = NETWORK_ERRORS.TIMEOUT;
          result.shouldRetry = true;
        } else if (error.message.includes("Network Error")) {
          result.userMessage = NETWORK_ERRORS.CONNECTION_FAILED;
          result.shouldRetry = true;
        } else {
          result.userMessage =
            error.response?.data?.message ||
            error.message ||
            GENERAL_ERRORS.UNEXPECTED_ERROR;
        }
    }

    // Show toast notification
    if (showToast) {
      toast.error(result.userMessage);
    }

    return result;
  }

  /**
   * Handle form validation errors
   */
  static handleFormError(
    error: ApiError,
    setFieldError?: (field: string, message: string) => void
  ): void {
    if (error.response?.data?.errors && setFieldError) {
      const errors = error.response.data.errors;
      Object.entries(errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          setFieldError(field, messages[0]);
        }
      });
    } else {
      this.handleApiError(error);
    }
  }

  /**
   * Handle payment errors specifically
   */
  static handlePaymentError(error: ApiError): ErrorHandlingResult {
    const context: ErrorContext = {
      action: "payment_processing",
      component: "PaymentForm",
    };

    return this.handleApiError(error, context);
  }

  /**
   * Handle authentication errors
   */
  static handleAuthError(error: ApiError): ErrorHandlingResult {
    const context: ErrorContext = {
      action: "authentication",
      component: "AuthForm",
    };

    const result = this.handleApiError(error, context);

    // Clear auth tokens on auth errors
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token");
    }

    return result;
  }

  /**
   * Get error severity based on status code
   */
  private static getErrorSeverity(status?: number): ErrorSeverity {
    if (!status) return ErrorSeverity.MEDIUM;

    if (status >= 500) return ErrorSeverity.HIGH;
    if (status === 401 || status === 403) return ErrorSeverity.MEDIUM;
    if (status >= 400) return ErrorSeverity.LOW;

    return ErrorSeverity.MEDIUM;
  }

  /**
   * Create a retry function for failed operations
   */
  static createRetryHandler(
    operation: () => Promise<unknown>,
    maxRetries: number = 3,
    delay: number = 1000
  ) {
    return async (): Promise<unknown> => {
      let lastError: Error;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          return await operation();
        } catch (error) {
          lastError = error as Error;

          if (attempt < maxRetries - 1) {
            await new Promise((resolve) =>
              setTimeout(resolve, delay * Math.pow(2, attempt))
            );
          }
        }
      }

      throw lastError!;
    };
  }
}

// Convenience functions
export const handleApiError = ErrorHandler.handleApiError;
export const handleFormError = ErrorHandler.handleFormError;
export const handlePaymentError = ErrorHandler.handlePaymentError;
export const handleAuthError = ErrorHandler.handleAuthError;
export const createRetryHandler = ErrorHandler.createRetryHandler;

// Hook for error handling in components
export const useErrorHandler = () => {
  return {
    handleApiError: ErrorHandler.handleApiError,
    handleFormError: ErrorHandler.handleFormError,
    handlePaymentError: ErrorHandler.handlePaymentError,
    handleAuthError: ErrorHandler.handleAuthError,
  };
};
