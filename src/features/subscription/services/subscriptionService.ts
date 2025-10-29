/**
 * Subscription Service
 * Feature-based service for subscription-related API calls
 */

import { BaseService } from "@/services/baseService";
import { API_ROUTES } from "@/constants/routes";
import { handleApiError } from "@/utils/errorHandler";
import type {
  SubscriptionPlan,
  UserCredits,
  PaymentMethod,
  Transaction,
  PropertyReport,
  PromoCodeValidation,
  PaymentIntentResponse,
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

// Response DTOs
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

class SubscriptionService extends BaseService {
  constructor() {
    super("/subscription");
  }

  // ================== SUBSCRIPTION PLANS ==================

  async getSubscriptionPlans(): Promise<
    ApiResponse<{ plans: SubscriptionPlan[] }>
  > {
    try {
      return await this.get(API_ROUTES.SUBSCRIPTION.PLANS);
    } catch (error) {
      handleApiError(error as Error, { action: "fetch_subscription_plans" });
      throw error;
    }
  }

  // ================== USER CREDITS ==================

  async getUserCredits(): Promise<ApiResponse<UserCredits>> {
    try {
      return await this.get(API_ROUTES.SUBSCRIPTION.CREDITS);
    } catch (error) {
      handleApiError(error as Error, { action: "fetch_user_credits" });
      throw error;
    }
  }

  // ================== STRIPE PAYMENT ==================

  async createPaymentIntent(
    data: CreatePaymentIntentRequest
  ): Promise<ApiResponse<PaymentIntentResponse>> {
    try {
      return await this.post(
        API_ROUTES.SUBSCRIPTION.CREATE_PAYMENT_INTENT,
        data
      );
    } catch (error) {
      handleApiError(error as Error, { action: "create_payment_intent" });
      throw error;
    }
  }

  async completePurchase(data: CompletePurchaseRequest): Promise<ApiResponse> {
    try {
      return await this.post(API_ROUTES.SUBSCRIPTION.COMPLETE_PURCHASE, data);
    } catch (error) {
      handleApiError(error as Error, { action: "complete_purchase" });
      throw error;
    }
  }

  // ================== PROMO CODES ==================

  async validatePromoCode(promoCode: string): Promise<PromoCodeValidation> {
    try {
      const response = await this.post(API_ROUTES.SUBSCRIPTION.VALIDATE_PROMO, {
        promoCode,
      });

      if (response.success && response.data) {
        return {
          valid: true,
          discount: response.data.discount,
        };
      } else {
        return {
          valid: false,
          error: response.message || "Invalid promo code",
        };
      }
    } catch (error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      return {
        valid: false,
        error:
          apiError.response?.data?.message || "Failed to validate promo code",
      };
    }
  }

  // ================== PAYMENT METHODS ==================

  async getPaymentMethods(): Promise<
    ApiResponse<{ paymentMethods: PaymentMethod[] }>
  > {
    try {
      return await this.get("/payment-methods");
    } catch (error) {
      handleApiError(error as Error, { action: "fetch_payment_methods" });
      throw error;
    }
  }

  async addPaymentMethod(
    data: AddPaymentMethodRequest
  ): Promise<ApiResponse<{ paymentMethod: PaymentMethod }>> {
    try {
      return await this.post("/payment-methods", data);
    } catch (error) {
      handleApiError(error as Error, { action: "add_payment_method" });
      throw error;
    }
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<ApiResponse> {
    try {
      return await this.delete(`/payment-methods/${paymentMethodId}`);
    } catch (error) {
      handleApiError(error as Error, { action: "delete_payment_method" });
      throw error;
    }
  }

  async setDefaultPaymentMethod(paymentMethodId: string): Promise<ApiResponse> {
    try {
      return await this.patch(
        `/payment-methods/${paymentMethodId}/default`,
        {}
      );
    } catch (error) {
      handleApiError(error as Error, { action: "set_default_payment_method" });
      throw error;
    }
  }

  // ================== TRANSACTIONS ==================

  async getUserTransactions(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Transaction>> {
    try {
      return await this.get(
        `${API_ROUTES.SUBSCRIPTION.TRANSACTIONS}?page=${page}&limit=${limit}`
      );
    } catch (error) {
      handleApiError(error as Error, { action: "fetch_user_transactions" });
      throw error;
    }
  }

  // ================== PROPERTY REPORTS ==================

  async generateReport(
    data: GenerateReportRequest
  ): Promise<ApiResponse<{ report: PropertyReport }>> {
    try {
      return await this.post(
        `${API_ROUTES.SUBSCRIPTION.REPORTS}/generate`,
        data
      );
    } catch (error) {
      handleApiError(error as Error, { action: "generate_report" });
      throw error;
    }
  }

  async getUserReports(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<PropertyReport>> {
    try {
      return await this.get(
        `${API_ROUTES.SUBSCRIPTION.REPORTS}?page=${page}&limit=${limit}`
      );
    } catch (error) {
      handleApiError(error as Error, { action: "fetch_user_reports" });
      throw error;
    }
  }

  async getReport(
    reportId: string
  ): Promise<ApiResponse<{ report: PropertyReport }>> {
    try {
      return await this.get(`${API_ROUTES.SUBSCRIPTION.REPORTS}/${reportId}`);
    } catch (error) {
      handleApiError(error as Error, { action: "fetch_report_detail" });
      throw error;
    }
  }

  async deleteReport(reportId: string): Promise<ApiResponse> {
    try {
      return await this.delete(
        `${API_ROUTES.SUBSCRIPTION.REPORTS}/${reportId}`
      );
    } catch (error) {
      handleApiError(error as Error, { action: "delete_report" });
      throw error;
    }
  }

  async downloadReportPDF(reportId: string): Promise<Blob> {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ROUTES.SUBSCRIPTION.REPORTS}/${reportId}/pdf`,
        {
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      handleApiError(error as Error, { action: "download_report_pdf" });
      throw error;
    }
  }

  // ================== ADMIN FUNCTIONS ==================

  async createSubscriptionPlan(data: {
    name: string;
    description: string;
    price: number;
    credits: number;
    expirationMonths?: number;
  }): Promise<ApiResponse<{ plan: SubscriptionPlan }>> {
    try {
      return await this.post("/admin/plans", data);
    } catch (error) {
      handleApiError(error as Error, { action: "create_subscription_plan" });
      throw error;
    }
  }

  async getAllTransactions(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Transaction>> {
    try {
      return await this.get(`/admin/transactions?page=${page}&limit=${limit}`);
    } catch (error) {
      handleApiError(error as Error, { action: "fetch_all_transactions" });
      throw error;
    }
  }

  async getAllReports(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<PropertyReport>> {
    try {
      return await this.get(`/admin/reports?page=${page}&limit=${limit}`);
    } catch (error) {
      handleApiError(error as Error, { action: "fetch_all_reports" });
      throw error;
    }
  }

  async updateReportStatus(
    reportId: string,
    status: string
  ): Promise<ApiResponse> {
    try {
      return await this.patch(`/admin/reports/${reportId}/status`, { status });
    } catch (error) {
      handleApiError(error as Error, { action: "update_report_status" });
      throw error;
    }
  }

  // ================== HELPER METHODS ==================

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  calculatePricePerReport(plan: SubscriptionPlan): string {
    const pricePerReport = plan.price / plan.credits;
    return this.formatCurrency(pricePerReport);
  }

  isSubscriptionExpired(expirationDate: string | null): boolean {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  }

  getDaysUntilExpiration(expirationDate: string | null): number | null {
    if (!expirationDate) return null;
    const now = new Date();
    const expiry = new Date(expirationDate);
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateDiscountAmount(
    originalPrice: number,
    discount: { type: "percentage" | "fixed"; value: number }
  ): number {
    if (!discount) return 0;

    if (discount.type === "percentage") {
      return (originalPrice * discount.value) / 100;
    } else if (discount.type === "fixed") {
      return Math.min(discount.value, originalPrice);
    }

    return 0;
  }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService;
