/**
 * Subscription Service
 * Direct class implementation following project patterns
 */

import apiClient from "@/lib/apiClient";
import { API_ROUTES } from "@/constants/routes";
import type {
  SubscriptionPlan,
  UserCredits,
  PaymentMethod,
  Transaction,
  PropertyReport,
  PromoCodeValidation,
} from "@/types/subscription";

// Request DTOs
export interface PurchaseSubscriptionRequest {
  planId: string;
  paymentMethodId: string;
  promoCode?: string;
}

export interface AddPaymentMethodRequest {
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface GenerateReportRequest {
  address: string;
  bedrooms: number;
  bathrooms: number;
  email: string;
}

export interface CreatePaymentIntentRequest {
  planId: string;
  amount: number;
  promoCode?: string;
  originalAmount?: number;
}

export interface CompletePurchaseRequest {
  paymentIntentId: string;
}

export class SubscriptionService {
  // ================== SUBSCRIPTION PLANS ==================

  getPlans() {
    return apiClient.get(API_ROUTES.SUBSCRIPTION.PLANS);
  }

  // ================== USER CREDITS ==================

  getUserCredits() {
    return apiClient.get(API_ROUTES.SUBSCRIPTION.CREDITS);
  }

  // ================== STRIPE PAYMENT ==================

  createPaymentIntent(payload: CreatePaymentIntentRequest) {
    return apiClient.post(
      API_ROUTES.SUBSCRIPTION.CREATE_PAYMENT_INTENT,
      payload
    );
  }

  completePurchase(payload: CompletePurchaseRequest) {
    return apiClient.post(API_ROUTES.SUBSCRIPTION.COMPLETE_PURCHASE, payload);
  }

  // ================== PROMO CODES ==================

  async validatePromoCode(promoCode: string): Promise<PromoCodeValidation> {
    try {
      const response = await apiClient.post(
        API_ROUTES.SUBSCRIPTION.VALIDATE_PROMO,
        {
          promoCode,
        }
      );

      if (response.data.success && response.data.data) {
        return {
          valid: true,
          discount: response.data.data.discount,
        };
      } else {
        return {
          valid: false,
          error: response.data.message || "Invalid promo code",
        };
      }
    } catch (error: any) {
      return {
        valid: false,
        error: error.response?.data?.message || "Failed to validate promo code",
      };
    }
  }

  // ================== PAYMENT METHODS ==================

  getPaymentMethods() {
    return apiClient.get("/subscription/payment-methods");
  }

  addPaymentMethod(payload: AddPaymentMethodRequest) {
    return apiClient.post("/subscription/payment-methods", payload);
  }

  deletePaymentMethod(paymentMethodId: string) {
    return apiClient.delete(`/subscription/payment-methods/${paymentMethodId}`);
  }

  setDefaultPaymentMethod(paymentMethodId: string) {
    return apiClient.patch(
      `/subscription/payment-methods/${paymentMethodId}/default`,
      {}
    );
  }

  // ================== TRANSACTIONS ==================

  getUserTransactions(params: { page?: number; limit?: number }) {
    return apiClient.get(`${API_ROUTES.SUBSCRIPTION.TRANSACTIONS}`, {
      params,
    });
  }

  // ================== PROPERTY REPORTS ==================

  generateReport(payload: GenerateReportRequest) {
    return apiClient.post(
      `${API_ROUTES.SUBSCRIPTION.REPORTS}/generate`,
      payload
    );
  }

  getUserReports(params: { page?: number; limit?: number }) {
    return apiClient.get(`${API_ROUTES.SUBSCRIPTION.REPORTS}`, {
      params,
    });
  }

  getReport({ reportId }: { reportId: string }) {
    return apiClient.get(`${API_ROUTES.SUBSCRIPTION.REPORTS}/${reportId}`);
  }

  deleteReport({ reportId }: { reportId: string }) {
    return apiClient.delete(`${API_ROUTES.SUBSCRIPTION.REPORTS}/${reportId}`);
  }

  downloadReportPDF({ reportId }: { reportId: string }) {
    return apiClient.get(`${API_ROUTES.SUBSCRIPTION.REPORTS}/${reportId}/pdf`, {
      responseType: "blob",
    });
  }

  // ================== ADMIN FUNCTIONS ==================

  createSubscriptionPlan(payload: {
    name: string;
    description: string;
    price: number;
    credits: number;
    expirationMonths?: number;
  }) {
    return apiClient.post("/subscription/admin/plans", payload);
  }

  getAllTransactions(params: { page?: number; limit?: number }) {
    return apiClient.get(`/subscription/admin/transactions`, {
      params,
    });
  }

  getAllReports(params: { page?: number; limit?: number }) {
    return apiClient.get(`/subscription/admin/reports`, {
      params,
    });
  }

  updateReportStatus({
    reportId,
    status,
  }: {
    reportId: string;
    status: string;
  }) {
    return apiClient.patch(`/subscription/admin/reports/${reportId}/status`, {
      status,
    });
  }
}
