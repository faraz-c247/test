/**
 * Subscription Hooks
 * Following project patterns with direct service calls
 */

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubscriptionService } from "@/services/subscriptionService";
import type {
  PurchaseSubscriptionRequest,
  AddPaymentMethodRequest,
  GenerateReportRequest,
  CreatePaymentIntentRequest,
  CompletePurchaseRequest,
} from "@/services/subscriptionService";

const SUBSCRIPTION_KEY = {
  PLANS: "subscription-plans",
  USER_CREDITS: "user-credits",
  PAYMENT_METHODS: "payment-methods",
  TRANSACTIONS: "user-transactions",
  REPORTS: "user-reports",
  REPORT_DETAIL: "report-detail",
  ADMIN_TRANSACTIONS: "admin-transactions",
  ADMIN_REPORTS: "admin-reports",
};

const subscriptionService = new SubscriptionService();

// ================== SUBSCRIPTION PLANS ==================

export const useSubscriptionPlansQuery = () => {
  return useQuery({
    queryKey: [SUBSCRIPTION_KEY.PLANS],
    queryFn: () => subscriptionService.getPlans(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ================== USER CREDITS ==================

export const useUserCreditsQuery = () => {
  return useQuery({
    queryKey: [SUBSCRIPTION_KEY.USER_CREDITS],
    queryFn: () => subscriptionService.getUserCredits(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// ================== STRIPE PAYMENT ==================

export const useCreatePaymentIntentMutation = () => {
  return useMutation({
    mutationFn: (input: CreatePaymentIntentRequest) =>
      subscriptionService.createPaymentIntent(input),
    onError: (error) => {
      let errorMessage = "Failed to create payment intent";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return errorMessage;
    },
  });
};

export const useCompletePurchaseMutation = () => {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (input: CompletePurchaseRequest) =>
      subscriptionService.completePurchase(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [SUBSCRIPTION_KEY.USER_CREDITS],
      });
      queryClient.invalidateQueries({
        queryKey: [SUBSCRIPTION_KEY.TRANSACTIONS],
      });
      return data;
    },
    onError: (error) => {
      let errorMessage = "Failed to complete purchase";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return errorMessage;
    },
  });

  return { ...mutation, progress };
};

// ================== PROMO CODES ==================

export const useValidatePromoCodeMutation = () => {
  return useMutation({
    mutationFn: (promoCode: string) =>
      subscriptionService.validatePromoCode(promoCode),
    onError: (error) => {
      let errorMessage = "Failed to validate promo code";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return errorMessage;
    },
  });
};

// ================== PAYMENT METHODS ==================

export const usePaymentMethodsQuery = () => {
  return useQuery({
    queryKey: [SUBSCRIPTION_KEY.PAYMENT_METHODS],
    queryFn: () => subscriptionService.getPaymentMethods(),
  });
};

export const useAddPaymentMethodMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddPaymentMethodRequest) =>
      subscriptionService.addPaymentMethod(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [SUBSCRIPTION_KEY.PAYMENT_METHODS],
      });
      return data;
    },
    onError: (error) => {
      let errorMessage = "Failed to add payment method";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return errorMessage;
    },
  });
};

export const useDeletePaymentMethodMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentMethodId: string) =>
      subscriptionService.deletePaymentMethod(paymentMethodId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [SUBSCRIPTION_KEY.PAYMENT_METHODS],
      });
      return data;
    },
    onError: (error) => {
      let errorMessage = "Failed to delete payment method";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return errorMessage;
    },
  });
};

// ================== TRANSACTIONS ==================

export const useUserTransactionsQuery = (params: {
  page?: number;
  limit?: number;
}) => {
  const userTransactionsQueryKey = [SUBSCRIPTION_KEY.TRANSACTIONS, params];

  const query = useQuery({
    queryKey: userTransactionsQueryKey,
    queryFn: () => subscriptionService.getUserTransactions(params),
    keepPreviousData: true,
  });

  const invalidateUserTransactionsQuery = useMutation({
    mutationFn: () => {
      queryClient.invalidateQueries({ queryKey: userTransactionsQueryKey });
    },
  });

  return {
    ...query,
    invalidateUserTransactionsQuery,
  };
};

// ================== PROPERTY REPORTS ==================

export const useGenerateReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: GenerateReportRequest) =>
      subscriptionService.generateReport(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [SUBSCRIPTION_KEY.USER_CREDITS],
      });
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_KEY.REPORTS] });
      return data;
    },
    onError: (error) => {
      let errorMessage = "Failed to generate report";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return errorMessage;
    },
  });
};

export const useUserReportsQuery = (params: {
  page?: number;
  limit?: number;
}) => {
  const userReportsQueryKey = [SUBSCRIPTION_KEY.REPORTS, params];

  const query = useQuery({
    queryKey: userReportsQueryKey,
    queryFn: () => subscriptionService.getUserReports(params),
    keepPreviousData: true,
  });

  const invalidateUserReportsQuery = useMutation({
    mutationFn: () => {
      queryClient.invalidateQueries({ queryKey: userReportsQueryKey });
    },
  });

  return {
    ...query,
    invalidateUserReportsQuery,
  };
};

export const useReportQuery = ({ reportId }: { reportId: string }) =>
  useQuery({
    queryKey: [SUBSCRIPTION_KEY.REPORT_DETAIL, { reportId }],
    queryFn: () => subscriptionService.getReport({ reportId }),
    enabled: !!reportId,
  });

export const useDeleteReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { reportId: string }) =>
      subscriptionService.deleteReport(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_KEY.REPORTS] });
      return data;
    },
    onError: (error) => {
      let errorMessage = "Failed to delete report";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return errorMessage;
    },
  });
};

// ================== ADMIN HOOKS ==================

export const useCreateSubscriptionPlanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      name: string;
      description: string;
      price: number;
      credits: number;
      expirationMonths?: number;
    }) => subscriptionService.createSubscriptionPlan(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_KEY.PLANS] });
      return data;
    },
    onError: (error) => {
      let errorMessage = "Failed to create subscription plan";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return errorMessage;
    },
  });
};

export const useAllTransactionsQuery = (params: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [SUBSCRIPTION_KEY.ADMIN_TRANSACTIONS, params],
    queryFn: () => subscriptionService.getAllTransactions(params),
    keepPreviousData: true,
  });
};

export const useAllReportsQuery = (params: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [SUBSCRIPTION_KEY.ADMIN_REPORTS, params],
    queryFn: () => subscriptionService.getAllReports(params),
    keepPreviousData: true,
  });
};

export const useUpdateReportStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { reportId: string; status: string }) =>
      subscriptionService.updateReportStatus(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [SUBSCRIPTION_KEY.ADMIN_REPORTS],
      });
      return data;
    },
    onError: (error) => {
      let errorMessage = "Failed to update report status";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return errorMessage;
    },
  });
};
