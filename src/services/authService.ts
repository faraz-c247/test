import {
  SignupData,
  LoginCredentials,
  UserWithoutPassword,
  ForgotPasswordData,
  ResetPasswordData,
} from "@/types/auth";
import { BaseService } from "./baseService";
import { getSession } from "next-auth/react";
import apiClient from "@/lib/apiClient";

export interface AuthResponse {
  user: UserWithoutPassword;
  token?: string;
  message?: string;
}

export interface LoginResponse extends AuthResponse {
  token: string;
}

class AuthService extends BaseService {
  constructor() {
    super("/auth");
  }

  async signup(userData: SignupData): Promise<AuthResponse> {
    return this.post<AuthResponse, SignupData>("/register", userData);
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await this.post<LoginResponse, LoginCredentials>(
      "/login",
      credentials
    );

    // Store token in localStorage for future requests
    if (response.token && typeof window !== "undefined") {
      localStorage.setItem("auth-token", response.token);
    }

    return response;
  }

  async getProfile(): Promise<UserWithoutPassword> {
    return this.get<UserWithoutPassword>("/me");
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    let authToken = null;

    try {
      console.log("Preparing logout - retrieving auth token...");

      // Try to get token from localStorage first
      if (typeof window !== "undefined") {
        authToken = localStorage.getItem("auth-token");
        console.log(
          "Token from localStorage:",
          authToken ? "Found" : "Not found"
        );
      }

      // If no token in localStorage, try to get from NextAuth session
      if (!authToken) {
        try {
          const session = await getSession();
          if (session && (session as any).backendToken) {
            authToken = (session as any).backendToken;
            console.log(
              "Token from NextAuth session:",
              authToken ? "Found" : "Not found"
            );
          }
        } catch (sessionError) {
          console.log("Could not retrieve session for logout token");
        }
      }

      // If we have a token, call the backend logout
      if (authToken) {
        console.log("Calling backend logout with token...");

        // Call backend logout endpoint with explicit token
        const response = await apiClient.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Backend logout response:", response.data);

        return {
          success: response.data?.success || true,
          message: response.data?.message || "Logged out successfully",
        };
      } else {
        console.log("No auth token found, skipping backend logout");
        return {
          success: true,
          message: "Logged out locally (no token found)",
        };
      }
    } catch (error: any) {
      console.error("Backend logout error:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        token: authToken ? "Present" : "Missing",
      });

      // If it's a 401, the token was invalid anyway, so logout is successful
      if (error.response?.status === 401) {
        return {
          success: true,
          message: "Logged out (token was already invalid)",
        };
      }

      // For other errors, still consider logout successful for frontend cleanup
      return {
        success: true,
        message: "Logged out locally (backend logout failed)",
      };
    } finally {
      // Always clear local token and any other stored auth data
      this.clearAllAuthData();
    }
  }

  async refreshToken(): Promise<string> {
    const response = await this.post<{ token: string }, {}>("/refresh", {});

    if (response.token && typeof window !== "undefined") {
      localStorage.setItem("auth-token", response.token);
    }

    return response.token;
  }

  getStoredToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth-token");
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  async forgotPassword(
    data: ForgotPasswordData
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.post<
        { success: boolean; message: string },
        ForgotPasswordData
      >("/forgot-password", data);
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to send reset email"
      );
    }
  }

  async resetPassword(
    data: ResetPasswordData
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.post<
        { success: boolean; message: string },
        ResetPasswordData
      >("/reset-password", data);
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  }

  async createUnregisteredUser(
    data: any
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await this.post<
        { success: boolean; message: string; data?: any },
        any
      >("/create-unregistered-user", data);
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to create user account"
      );
    }
  }

  clearAllAuthData(): void {
    if (typeof window !== "undefined") {
      // Clear localStorage items
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user-data");
      localStorage.removeItem("refresh-token");

      // Clear sessionStorage items
      sessionStorage.removeItem("auth-token");
      sessionStorage.removeItem("user-data");

      console.log("All auth data cleared from storage");
    }
  }
}

export const authService = new AuthService();
