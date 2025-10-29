import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession, getSession } from "next-auth/react";
import {
  authService,
  AuthResponse,
  LoginResponse,
} from "@/services/authService";
import {
  SignupData,
  LoginCredentials,
  UserWithoutPassword,
  ForgotPasswordData,
  ResetPasswordData,
} from "@/types/auth";
import { invalidateJWT } from "@/lib/auth";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
} as const;

// Signup mutation
export function useSignup() {
  const router = useRouter();

  return useMutation<AuthResponse, Error, SignupData>({
    mutationFn: (userData: SignupData) => authService.signup(userData),
    onSuccess: () => {
      router.push("/login?message=Account created successfully");
    },
    onError: (error) => {
      console.error("Signup error:", error.message);
    },
  });
}

// Login mutation with NextAuth integration
export function useLogin() {
  const router = useRouter();

  return useMutation<any, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });
      console.log("result  ", result);
      if (result?.error) {
        throw new Error("Invalid email or password");
      }

      return result;
    },
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Login error:", error.message);
    },
  });
}

// Enhanced logout mutation with JWT invalidation
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<{ success: boolean; message: string }, Error, void>({
    mutationFn: async () => {
      console.log("Starting comprehensive logout process...");

      // Step 1: Get current session and ensure backend token is available
      let currentSession = session;
      if (!currentSession) {
        try {
          currentSession = await getSession();
        } catch (error) {
          console.log("Could not get current session for logout");
        }
      }

      // Store backend token in localStorage if available from session
      if (currentSession?.backendToken && typeof window !== "undefined") {
        const existingToken = localStorage.getItem("auth-token");
        if (!existingToken && currentSession.backendToken) {
          console.log("Storing backend token from session for logout");
          localStorage.setItem("auth-token", currentSession.backendToken);
        }
      }

      // Step 2: Invalidate JWT token
      if (currentSession && (currentSession as any).jti) {
        console.log("Invalidating JWT token:", (currentSession as any).jti);
        invalidateJWT((currentSession as any).jti);
      }

      // Step 3: Call backend logout (this should now have the token)
      let backendResponse;
      try {
        backendResponse = await authService.logout();
        console.log("Backend logout completed:", backendResponse);
      } catch (error) {
        console.log("Backend logout failed, continuing with frontend cleanup");
        backendResponse = {
          success: true,
          message: "Logged out locally (backend logout failed)",
        };
      }

      // Step 4: Clear all data immediately after backend call
      console.log("Clearing React Query cache and auth data...");
      queryClient.clear();
      authService.clearAllAuthData();

      // Step 5: Sign out from NextAuth with explicit redirect disabled
      console.log("Signing out from NextAuth...");
      await signOut({
        redirect: false,
        callbackUrl: "/", // This won't be used since redirect is false
      });

      // Step 6: Additional cleanup - clear all possible auth data
      if (typeof window !== "undefined") {
        // Clear localStorage and sessionStorage completely
        localStorage.clear();
        sessionStorage.clear();

        // Clear all cookies more aggressively
        const cookies = document.cookie.split(";");
        cookies.forEach((cookie) => {
          const eqPos = cookie.indexOf("=");
          const name =
            eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

          // Clear with multiple path and domain combinations
          const clearCookie = (path: string, domain?: string) => {
            let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
            if (domain) {
              cookieString += `; domain=${domain}`;
            }
            document.cookie = cookieString;
          };

          // Clear with different paths
          clearCookie("/");
          clearCookie("/", window.location.hostname);
          clearCookie("/", `.${window.location.hostname}`);
        });

        console.log("All auth data and cookies cleared");
      }

      console.log("NextAuth signout completed");
      return backendResponse;
    },
    onSuccess: (response) => {
      console.log("Logout successful:", response.message);

      // Force redirect with a longer delay to ensure session is completely cleared
      if (typeof window !== "undefined") {
        setTimeout(() => {
          console.log("Redirecting to homepage...");
          // Force a full page reload to ensure clean state
          window.location.href = "/";
        }, 1000); // Increased delay to 1 second to ensure all cleanup completes
      }
    },
    onError: (error) => {
      console.error("Logout error:", error.message);

      // Even if logout fails, clear frontend state and redirect
      queryClient.clear();
      authService.clearAllAuthData();

      // Force comprehensive cleanup and redirect
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();

        // Force sign out and redirect after delay
        signOut({ redirect: false }).then(() => {
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        });
      }
    },
  });
}

// Force session refresh
export function useForceSessionRefresh() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      // Clear session cache
      queryClient.invalidateQueries({ queryKey: ["session"] });

      // Force NextAuth to refresh the session
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);

      // Wait a bit for the session to refresh
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      console.log("Session refresh forced");
    },
  });
}

// Profile query
export function useProfile(enabled: boolean = true) {
  return useQuery<UserWithoutPassword, Error>({
    queryKey: authKeys.profile(),
    queryFn: () => authService.getProfile(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// Refresh token mutation
export function useRefreshToken() {
  return useMutation<string, Error, void>({
    mutationFn: () => authService.refreshToken(),
    onError: (error) => {
      console.error("Token refresh error:", error.message);
    },
  });
}

// Check authentication status
export function useAuthStatus() {
  return {
    isAuthenticated: authService.isAuthenticated(),
    token: authService.getStoredToken(),
  };
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      return await authService.forgotPassword(data);
    },
    onError: (error: Error) => {
      console.error("Forgot password error:", error);
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      return await authService.resetPassword(data);
    },
    onError: (error: Error) => {
      console.error("Reset password error:", error);
    },
  });
}

export function useCreateUnregisteredUser() {
  return useMutation({
    mutationFn: async (data: any) => {
      return await authService.createUnregisteredUser(data);
    },
    onError: (error: Error) => {
      console.error("Create unregistered user error:", error);
    },
  });
}
