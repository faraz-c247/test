import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import {
  userService,
  CreateUserRequest,
  UpdateUserRequest,
  User,
} from "../services/userService";
import { toast } from "react-hot-toast";

// Query Keys
export const USER_QUERY_KEYS = {
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,
  usersList: (page: number, limit: number, search?: string) =>
    ["users", "list", page, limit, search] as const,
} as const;

/**
 * Hook for getting paginated users list
 */
export function useUsers(
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortBy?: string,
  orderBy?: string
) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.usersList(page, limit, search),
    queryFn: () => userService.getUsers(page, limit, search, sortBy, orderBy),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for getting a single user by ID
 */
export function useUser(userId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.user(userId),
    queryFn: () => userService.getUserById(userId),
    enabled: enabled && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for creating a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserRequest) =>
      userService.createUser(userData),
    onSuccess: (response) => {
      toast.success(response.message || "User created successfully!");
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create user";
      toast.error(message);
    },
  });
}

/**
 * Hook for updating a user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: UpdateUserRequest;
    }) => userService.updateUser(userId, userData),
    onSuccess: (response, { userId }) => {
      toast.success(response.message || "User updated successfully!");
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.user(userId) });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update user";
      toast.error(message);
    },
  });
}

/**
 * Hook for deleting a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: (response) => {
      toast.success(response.message || "User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete user";
      toast.error(message);
    },
  });
}

/**
 * Hook for changing user status
 */
export function useChangeUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: number }) =>
      userService.changeUserStatus(userId, status),
    onSuccess: (response, { userId }) => {
      const statusText =
        response.data.status === 1 ? "activated" : "deactivated";
      toast.success(`User ${statusText} successfully!`);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users });
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.user(userId) });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to change user status";
      toast.error(message);
    },
  });
}

/**
 * Hook for bulk operations (if needed)
 */
export function useBulkUserOperations() {
  const queryClient = useQueryClient();

  const bulkDelete = useMutation({
    mutationFn: async (userIds: string[]) => {
      const results = await Promise.allSettled(
        userIds.map((id) => userService.deleteUser(id))
      );
      return results;
    },
    onSuccess: (results) => {
      const successful = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failed = results.length - successful;

      if (successful > 0) {
        toast.success(`${successful} user(s) deleted successfully!`);
      }
      if (failed > 0) {
        toast.error(`${failed} user(s) failed to delete`);
      }

      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users });
    },
    onError: (error: any) => {
      toast.error("Failed to delete users");
    },
  });

  const bulkStatusChange = useMutation({
    mutationFn: async ({
      userIds,
      status,
    }: {
      userIds: string[];
      status: number;
    }) => {
      const results = await Promise.allSettled(
        userIds.map((id) => userService.changeUserStatus(id, status))
      );
      return results;
    },
    onSuccess: (results, { status }) => {
      const successful = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failed = results.length - successful;
      const statusText = status === 1 ? "activated" : "deactivated";

      if (successful > 0) {
        toast.success(`${successful} user(s) ${statusText} successfully!`);
      }
      if (failed > 0) {
        toast.error(`${failed} user(s) failed to update`);
      }

      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users });
    },
    onError: (error: any) => {
      toast.error("Failed to update user statuses");
    },
  });

  return {
    bulkDelete,
    bulkStatusChange,
  };
}

/**
 * Hook for getting user profile
 */
export function useUserProfile() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => authService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for updating user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => userService.updateProfile(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Profile updated successfully!");
        queryClient.invalidateQueries({
          queryKey: ["user", "profile"],
        });
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });
}

/**
 * Hook for changing password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      userService.changePassword(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Password changed successfully!");
      } else {
        toast.error(response.message || "Failed to change password");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to change password");
    },
  });
}

/**
 * Hook for deleting account
 */
export function useDeleteAccount() {
  return useMutation({
    mutationFn: (password: string) => userService.deleteAccount(password),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Account deleted successfully!");
      } else {
        toast.error(response.message || "Failed to delete account");
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete account");
    },
  });
}
