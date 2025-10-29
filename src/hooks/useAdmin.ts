import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { useUserTransactionsQuery } from "@/hooks/useSubscription";
import type { AdminStats, User } from "@/services/adminService";
import { toast } from "react-hot-toast";

// Query Keys
export const ADMIN_QUERY_KEYS = {
  stats: ["admin", "stats"] as const,
  users: ["admin", "users"] as const,
  user: (id: string) => ["admin", "users", id] as const,
  reports: ["admin", "reports"] as const,
  systemHealth: ["admin", "system-health"] as const,
} as const;

/**
 * Hook for getting admin dashboard statistics
 * Uses the new backend admin stats endpoint
 */
export function useAdminStats() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.stats,
    queryFn: () => adminService.getAdminStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}

/**
 * Hook for getting all users (admin view)
 * Uses existing /user endpoint
 */
export function useAllUsers(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.users, page, limit],
    queryFn: () => adminService.getAllUsers(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for getting all reports from all users (admin view)
 * Uses the new /property/admin/all endpoint
 */
export function useAllReports(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.reports, page, limit],
    queryFn: () => adminService.getAllReports(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for getting user by ID
 * Uses existing /user/:userId endpoint
 */
export function useUserById(userId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.user(userId),
    queryFn: () => adminService.getUserById(userId),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for getting system health
 * Returns mock data since no system health endpoint exists yet
 */
export function useSystemHealth() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.systemHealth,
    queryFn: () => adminService.getSystemHealth(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
}

/**
 * Hook for updating user (admin action)
 * Uses existing /user/:userId endpoint
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: Partial<User>;
    }) => adminService.updateUser(userId, userData),
    onSuccess: (response, { userId }) => {
      toast.success("User updated successfully");

      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.users });
      queryClient.invalidateQueries({
        queryKey: ADMIN_QUERY_KEYS.user(userId),
      });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update user";
      toast.error(message);
    },
  });
}

/**
 * Hook for deleting user (admin action)
 * Uses existing /user/:userId endpoint
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: () => {
      toast.success("User deleted successfully");

      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.users });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete user";
      toast.error(message);
    },
  });
}

/**
 * Hook for changing user status (admin action)
 * Uses existing /user/change-status/:userId endpoint
 */
export function useChangeUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      statusData,
    }: {
      userId: string;
      statusData: { isActive: boolean };
    }) => adminService.changeUserStatus(userId, statusData),
    onSuccess: (response, { userId }) => {
      toast.success("User status updated successfully");

      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.users });
      queryClient.invalidateQueries({
        queryKey: ADMIN_QUERY_KEYS.user(userId),
      });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update user status";
      toast.error(message);
    },
  });
}

/**
 * Hook for creating new user (admin action)
 * Uses existing /user endpoint
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Partial<User>) => adminService.createUser(userData),
    onSuccess: () => {
      toast.success("User created successfully");

      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.users });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.stats });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create user";
      toast.error(message);
    },
  });
}

/**
 * Hook for calculating stats from raw data (fallback when API doesn't provide stats)
 * This is now a backup in case the main admin stats endpoint fails
 */
export function useCalculatedAdminStats() {
  const { data: usersData } = useAllUsers(1, 1000); // Get more users for stats
  const { data: transactionsData } = useUserTransactionsQuery({
    page: 1,
    limit: 1000,
  }); // Get transactions for revenue

  const users = usersData?.data?.users || [];
  const transactions = transactionsData?.data?.transactions || [];

  // Calculate stats from available data
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => {
    const lastActivity = new Date(user.updatedAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastActivity > thirtyDaysAgo;
  }).length;

  // For reports, we'll use a placeholder since property endpoint is user-specific
  const totalReports = 0; // Placeholder until we get proper admin endpoint
  const reportsToday = 0; // Placeholder

  // Calculate revenue from transactions
  const totalRevenue = transactions.reduce(
    (sum, transaction) => sum + (transaction.amount || 0),
    0
  );
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = transactions
    .filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);

  const totalCredits = transactions.reduce(
    (sum, transaction) => sum + (transaction.metadata?.totalCredits || 0),
    0
  );
  const activeSubscriptions = activeUsers; // Simplified

  return {
    data: {
      totalUsers,
      activeUsers,
      totalReports,
      reportsToday,
      totalRevenue,
      monthlyRevenue,
      totalCredits,
      activeSubscriptions,
    },
    isLoading: false,
  };
}
