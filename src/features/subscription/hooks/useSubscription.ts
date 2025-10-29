/**
 * Subscription Hooks
 * Feature-based hooks for subscription functionality
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { QUERY_KEYS } from "@/constants/queryKeys";
import {
  SUCCESS_MESSAGES,
  SUBSCRIPTION_ERRORS,
} from "@/constants/errorMessages";
import { handleApiError } from "@/utils/errorHandler";
import { subscriptionService } from "../services/subscriptionService";
import type {
  PurchaseSubscriptionRequest,
  AddPaymentMethodRequest,
  GenerateReportRequest,
  CreatePaymentIntentRequest,
  CompletePurchaseRequest,
} from "../services/subscriptionService";

// ================== SUBSCRIPTION PLANS ==================

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUBSCRIPTIONS.PLANS,
    queryFn: () => subscriptionService.getSubscriptionPlans(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      const status = (error as { status?: number }).status;
      return status ? status >= 500 && failureCount < 3 : failureCount < 3;
    },
    meta: {
      errorMessage: SUBSCRIPTION_ERRORS.PLANS_LOAD_FAILED,
    },
  });
};

// ================== USER CREDITS ==================

export const useUserCredits = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUBSCRIPTIONS.USER_CREDITS,
    queryFn: () => subscriptionService.getUserCredits(),
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: (failureCount, error) => {
      const status = (error as { status?: number }).status;
      return status ? status >= 500 && failureCount < 3 : failureCount < 3;
    },
    meta: {
      errorMessage: SUBSCRIPTION_ERRORS.CREDITS_LOAD_FAILED,
    },
  });
};

// ================== STRIPE PAYMENT ==================

export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: (data: CreatePaymentIntentRequest) =>
      subscriptionService.createPaymentIntent(data),
    onError: (error) => {
      handleApiError(error as Error, {
        action: "create_payment_intent",
        component: "PaymentForm",
      });
    },
    meta: {
      errorMessage: SUBSCRIPTION_ERRORS.PAYMENT_INTENT_FAILED,
    },
  });
};

export const useCompletePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CompletePurchaseRequest) =>
      subscriptionService.completePurchase(data),
    retry: false, // Disable retries to prevent duplicate purchases
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || SUCCESS_MESSAGES.PURCHASE_SUCCESS);

        // Invalidate related queries
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.SUBSCRIPTIONS.USER_CREDITS,
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.SUBSCRIPTIONS.TRANSACTIONS(1, 10),
        });
      } else {
        toast.error(
          response.message || SUBSCRIPTION_ERRORS.PURCHASE_COMPLETION_FAILED
        );
      }
    },
    onError: (error) => {
      handleApiError(error as Error, {
        action: "complete_purchase",
        component: "PaymentForm",
      });
    },
    meta: {
      errorMessage: SUBSCRIPTION_ERRORS.PURCHASE_COMPLETION_FAILED,
    },
  });
};

// ================== SUBSCRIPTION PURCHASE (LEGACY) ==================

export const usePurchaseSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PurchaseSubscriptionRequest) =>
      subscriptionService.purchaseSubscription(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || SUCCESS_MESSAGES.PURCHASE_SUCCESS);

        // Invalidate related queries
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.SUBSCRIPTIONS.USER_CREDITS,
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.SUBSCRIPTIONS.TRANSACTIONS(1, 10),
        });
      } else {
        toast.error(
          response.message || SUBSCRIPTION_ERRORS.PURCHASE_COMPLETION_FAILED
        );
      }
    },
    onError: (error) => {
      handleApiError(error as Error, {
        action: "purchase_subscription",
        component: "SubscriptionForm",
      });
    },
  });
};

// ================== PAYMENT METHODS ==================

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SUBSCRIPTIONS.PAYMENT_METHODS,
    queryFn: () => subscriptionService.getPaymentMethods(),
    retry: 3,
  });
};

export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddPaymentMethodRequest) =>
      subscriptionService.addPaymentMethod(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || SUCCESS_MESSAGES.DATA_SAVED);
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.SUBSCRIPTIONS.PAYMENT_METHODS,
        });
      } else {
        toast.error(response.message || "Failed to add payment method");
      }
    },
    onError: (error) => {
      handleApiError(error as Error, {
        action: "add_payment_method",
        component: "PaymentMethodForm",
      });
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentMethodId: string) =>
      subscriptionService.deletePaymentMethod(paymentMethodId),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(
          response.message || "Payment method deleted successfully"
        );
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.SUBSCRIPTIONS.PAYMENT_METHODS,
        });
      } else {
        toast.error(response.message || "Failed to delete payment method");
      }
    },
    onError: (error) => {
      handleApiError(error as Error, {
        action: "delete_payment_method",
        component: "PaymentMethodList",
      });
    },
  });
};

// ================== TRANSACTIONS ==================

export const useUserTransactions = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: QUERY_KEYS.SUBSCRIPTIONS.TRANSACTIONS(page, limit),
    queryFn: () => subscriptionService.getUserTransactions(page, limit),
    keepPreviousData: true,
    retry: 3,
  });
};

// ================== PROPERTY REPORTS ==================

export const useGenerateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateReportRequest) =>
      subscriptionService.generateReport(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || SUCCESS_MESSAGES.REPORT_GENERATED);

        // Invalidate related queries
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.SUBSCRIPTIONS.USER_CREDITS,
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.REPORTS.USER_REPORTS(1, 10),
        });
      } else {
        toast.error(
          response.message || SUBSCRIPTION_ERRORS.REPORT_GENERATION_FAILED
        );
      }
    },
    onError: (error) => {
      handleApiError(error as Error, {
        action: "generate_report",
        component: "ReportForm",
      });
    },
  });
};

export const useUserReports = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.USER_REPORTS(page, limit),
    queryFn: () => subscriptionService.getUserReports(page, limit),
    keepPreviousData: true,
    retry: 3,
  });
};

export const useReport = (reportId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.DETAIL(reportId),
    queryFn: () => subscriptionService.getReport(reportId),
    enabled: !!reportId,
    retry: 3,
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportId: string) =>
      subscriptionService.deleteReport(reportId),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Report deleted successfully");
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.REPORTS.USER_REPORTS(1, 10),
        });
      } else {
        toast.error(response.message || "Failed to delete report");
      }
    },
    onError: (error) => {
      handleApiError(error as Error, {
        action: "delete_report",
        component: "ReportList",
      });
    },
  });
};

// ================== PROMO CODES ==================

export const useValidatePromoCode = () => {
  return useMutation({
    mutationFn: (promoCode: string) =>
      subscriptionService.validatePromoCode(promoCode),
    onError: (error) => {
      handleApiError(error as Error, {
        action: "validate_promo_code",
        component: "PromoCodeForm",
      });
    },
  });
};

// ================== ADMIN HOOKS ==================

export const useCreateSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      description: string;
      price: number;
      credits: number;
      expirationMonths?: number;
    }) => subscriptionService.createSubscriptionPlan(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(
          response.message || "Subscription plan created successfully"
        );
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.SUBSCRIPTIONS.PLANS,
        });
      } else {
        toast.error(response.message || "Failed to create subscription plan");
      }
    },
    onError: (error) => {
      handleApiError(error as Error, {
        action: "create_subscription_plan",
        component: "AdminPlanForm",
      });
    },
  });
};

export const useAllTransactions = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.INVOICES(page, limit),
    queryFn: () => subscriptionService.getAllTransactions(page, limit),
    keepPreviousData: true,
    retry: 3,
  });
};

export const useAllReports = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.ADMIN_REPORTS(page, limit),
    queryFn: () => subscriptionService.getAllReports(page, limit),
    keepPreviousData: true,
    retry: 3,
  });
};

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, status }: { reportId: string; status: string }) =>
      subscriptionService.updateReportStatus(reportId, status),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Report status updated successfully");
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.REPORTS.ADMIN_REPORTS(1, 20),
        });
      } else {
        toast.error(response.message || "Failed to update report status");
      }
    },
    onError: (error) => {
      handleApiError(error as Error, {
        action: "update_report_status",
        component: "AdminReportList",
      });
    },
  });
};
