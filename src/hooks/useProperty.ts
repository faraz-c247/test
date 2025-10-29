import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  propertyService,
  PropertyAnalysisRequest,
  QuickEstimateRequest,
} from "../services/propertyService";
import { toast } from "react-hot-toast";

// Query Keys
export const PROPERTY_QUERY_KEYS = {
  properties: ["properties"] as const,
  property: (id: string) => ["properties", id] as const,
  report: (reportId: string) => ["reports", reportId] as const,
  marketInsights: (zipCode: string) => ["market-insights", zipCode] as const,
} as const;

/**
 * Hook for creating property analysis
 */
export function useCreatePropertyAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PropertyAnalysisRequest) =>
      propertyService.createPropertyAnalysis(data),
    onSuccess: (response) => {
      toast.success(
        "Property analysis started! We'll notify you when it's complete."
      );
      queryClient.invalidateQueries({
        queryKey: PROPERTY_QUERY_KEYS.properties,
      });

      // Start polling for completion
      if (response.data) {
        pollAnalysisCompletion(response.data.propertyId, queryClient);
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create property analysis";
      toast.error(message);
    },
  });
}

/**
 * Hook for getting quick rent estimate
 */
export function useQuickEstimate() {
  return useMutation({
    mutationFn: (data: QuickEstimateRequest) =>
      propertyService.getQuickEstimate(data),
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to get rent estimate";
      toast.error(message);
    },
  });
}

/**
 * Hook for getting user's properties
 */
export function useUserProperties(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...PROPERTY_QUERY_KEYS.properties, page, limit],
    queryFn: () => propertyService.getUserProperties(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for getting user's reports (alias for getUserProperties for dashboard)
 */
export function useUserReports(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...PROPERTY_QUERY_KEYS.properties, "reports", page, limit],
    queryFn: () => propertyService.getUserProperties(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for getting property analysis by ID
 */
export function usePropertyAnalysis(
  propertyId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: PROPERTY_QUERY_KEYS.property(propertyId),
    queryFn: () => propertyService.getPropertyAnalysis(propertyId),
    enabled: enabled && !!propertyId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for getting property report
 */
export function usePropertyReport(reportId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: PROPERTY_QUERY_KEYS.report(reportId),
    queryFn: () => propertyService.getPropertyReport(reportId),
    enabled: enabled && !!reportId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for getting market insights
 */
export function useMarketInsights(zipCode: string, enabled: boolean = true) {
  return useQuery({
    queryKey: PROPERTY_QUERY_KEYS.marketInsights(zipCode),
    queryFn: () => propertyService.getMarketInsights(zipCode),
    enabled: enabled && !!zipCode,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook for deleting property analysis
 */
export function useDeletePropertyAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: string) =>
      propertyService.deletePropertyAnalysis(propertyId),
    onSuccess: () => {
      toast.success("Property analysis deleted successfully");
      queryClient.invalidateQueries({
        queryKey: PROPERTY_QUERY_KEYS.properties,
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete property analysis";
      toast.error(message);
    },
  });
}

/**
 * Hook for polling analysis status
 */
export function usePollAnalysisStatus(
  propertyId: string,
  enabled: boolean = false
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...PROPERTY_QUERY_KEYS.property(propertyId), "status"],
    queryFn: () => propertyService.getPropertyAnalysis(propertyId),
    enabled: enabled && !!propertyId,
    refetchInterval: (data) => {
      // Stop polling if analysis is completed or failed
      if (
        data?.data?.status === "completed" ||
        data?.data?.status === "failed"
      ) {
        return false;
      }
      return 3000; // Poll every 3 seconds
    },
    onSuccess: (response) => {
      if (response.data.status === "completed") {
        toast.success("Property analysis completed!");
        queryClient.invalidateQueries({
          queryKey: PROPERTY_QUERY_KEYS.properties,
        });
      } else if (response.data.status === "failed") {
        toast.error("Property analysis failed. Please try again.");
      }
    },
  });
}

/**
 * Helper function to start polling analysis completion
 */
async function pollAnalysisCompletion(propertyId: string, queryClient: any) {
  try {
    await propertyService.pollAnalysisStatus(propertyId);
    queryClient.invalidateQueries({ queryKey: PROPERTY_QUERY_KEYS.properties });
    queryClient.invalidateQueries({
      queryKey: PROPERTY_QUERY_KEYS.property(propertyId),
    });
    toast.success("Property analysis completed!");
  } catch (error) {
    console.error("Analysis polling failed:", error);
    toast.error("Analysis is taking longer than expected. Check back later.");
  }
}
