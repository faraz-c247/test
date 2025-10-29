import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserWithoutPassword } from "@/types/auth";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_REST_API_ENDPOINT || "http://localhost:8000/api/v1";

// JWT Blacklist Management using browser storage
class JWTBlacklist {
  private static readonly STORAGE_KEY = "nextauth-jwt-blacklist";
  private static readonly MAX_ENTRIES = 1000; // Prevent unlimited growth

  private static getBlacklist(): Set<string> {
    if (typeof window === "undefined") return new Set();

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (error) {
      console.warn("Failed to load JWT blacklist from storage:", error);
      return new Set();
    }
  }

  private static saveBlacklist(blacklist: Set<string>): void {
    if (typeof window === "undefined") return;

    try {
      // Limit size to prevent storage overflow
      const entries = Array.from(blacklist);
      const limitedEntries = entries.slice(-this.MAX_ENTRIES);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedEntries));
    } catch (error) {
      console.warn("Failed to save JWT blacklist to storage:", error);
    }
  }

  static add(jti: string): void {
    const blacklist = this.getBlacklist();
    blacklist.add(jti);
    this.saveBlacklist(blacklist);
    console.log("Added JWT to persistent blacklist:", jti);
  }

  static has(jti: string): boolean {
    const blacklist = this.getBlacklist();
    return blacklist.has(jti);
  }

  static clear(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log("JWT blacklist cleared");
    }
  }

  static cleanup(): void {
    // Clean up old entries (optional, could be based on timestamp)
    const blacklist = this.getBlacklist();
    if (blacklist.size > this.MAX_ENTRIES) {
      const entries = Array.from(blacklist);
      const recentEntries = entries.slice(-Math.floor(this.MAX_ENTRIES * 0.8));
      this.saveBlacklist(new Set(recentEntries));
      console.log(
        "JWT blacklist cleaned up, entries reduced to:",
        recentEntries.length
      );
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          console.log(
            "Attempting to authenticate with backend:",
            `${API_BASE_URL}/auth/login`
          );

          // Call your backend API for authentication
          const response = await axios.post(
            `${API_BASE_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
              timeout: 10000,
            }
          );

          console.log("Backend response status:", response.status);
          console.log("Backend response data:", response.data);

          const responseData = response.data;
          console.log("response  ", response);
          // Handle your backend's response format: { success, message, data: { token, role } }
          if (responseData.success && responseData.data) {
            const { token, role } = responseData.data;

            if (token) {
              console.log(
                "Authentication successful for user:",
                credentials.email
              );

              // Optionally fetch user profile
              let userProfile = null;
              try {
                const profileResponse = await axios.get(
                  `${API_BASE_URL}/auth/me`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                    timeout: 5000,
                  }
                );

                if (profileResponse.data.success && profileResponse.data.data) {
                  userProfile = profileResponse.data.data;
                  console.log("User profile fetched:", userProfile);
                }
              } catch (profileError) {
                console.log("Could not fetch user profile, using basic info");
              }

              return {
                id: extractUserIdFromToken(token),
                name:
                  userProfile?.name ||
                  userProfile?.fullName ||
                  credentials.email.split("@")[0],
                email: userProfile?.email || credentials.email,
                token: token,
                role: role,
                profile: userProfile,
              };
            } else {
              console.log("No token in response");
              return null;
            }
          } else {
            console.log("Login failed:", responseData.message);
            return null;
          }
        } catch (error: any) {
          console.error(error, "Backend authentication error:", {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            url: error.config?.url,
          });
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // Update session every hour
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/", // Redirect to homepage on error
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Check if token is blacklisted
      if (token.jti && JWTBlacklist.has(token.jti)) {
        console.log("JWT token is blacklisted, invalidating session");
        // Return an empty token to invalidate
        return {
          ...token,
          id: undefined,
          backendToken: undefined,
          jti: `invalidated_${Date.now()}`,
        };
      }

      // Store the backend token in JWT
      if (user && account) {
        // Generate a unique JWT ID for blacklisting
        token.jti = `${user.id}_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.backendToken = (user as any).token; // Store backend token
        token.role = (user as any).role; // Store user role
        token.profile = (user as any).profile; // Store full profile
      }

      return token;
    },
    async session({ session, token }) {
      // If no token or token is blacklisted, return empty session
      if (!token || !token.id || (token.jti && JWTBlacklist.has(token.jti))) {
        console.log("Session invalid or blacklisted, returning empty session");
        return {
          ...session,
          user: { id: "", name: null, email: null },
          expires: new Date(0).toISOString(), // Expired date
        };
      }

      // Populate session with token data
      session.user.id = token.id;
      session.user.name = token.name || null;
      session.user.email = token.email || null;
      session.backendToken = token.backendToken;
      session.role = token.role;
      session.profile = token.profile;

      // Store jti in session for logout use
      (session as any).jti = token.jti;

      // Store backend token in localStorage for API calls (client-side only)
      if (typeof window !== "undefined" && token.backendToken) {
        const existingToken = localStorage.getItem("auth-token");
        if (!existingToken || existingToken !== token.backendToken) {
          localStorage.setItem("auth-token", token.backendToken);
          console.log("Backend token stored in localStorage for API calls");
        }
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("NextAuth redirect callback:", { url, baseUrl });

      // Handle signout - always redirect to homepage
      if (url.includes("/api/auth/signout") || url.includes("signout")) {
        console.log("Signout detected, redirecting to homepage");
        return `${baseUrl}/`;
      }

      // Handle signin - redirect to dashboard (role-based redirect will be handled client-side)
      if (url.includes("/api/auth/signin") || url.includes("signin")) {
        console.log("Signin detected, redirecting to dashboard");
        return `${baseUrl}/dashboard`;
      }

      // Handle callback - redirect to dashboard (role-based redirect will be handled client-side)
      if (url.includes("/api/auth/callback")) {
        console.log("Callback detected, redirecting to dashboard");
        return `${baseUrl}/dashboard`;
      }

      // Handle relative URLs
      if (url.startsWith("/")) {
        console.log("Relative URL detected:", url);
        return `${baseUrl}${url}`;
      }

      // Handle same origin URLs
      if (new URL(url).origin === baseUrl) {
        console.log("Same origin URL detected:", url);
        return url;
      }

      console.log("Default redirect to baseUrl");
      return baseUrl;
    },
  },
  events: {
    async signOut(message) {
      console.log("NextAuth signOut event:", message);

      // Add JWT to blacklist if available
      if (message.token?.jti) {
        JWTBlacklist.add(message.token.jti);
        console.log(
          "Added JWT to blacklist on signOut event:",
          message.token.jti
        );
      }
    },
    async session({ session, token }) {
      // Log session events for debugging and cleanup blacklist periodically
      if (Math.random() < 0.01) {
        // 1% chance to trigger cleanup
        JWTBlacklist.cleanup();
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
};

// Helper function to extract user ID from JWT token
function extractUserIdFromToken(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || payload.id || payload.userId || "unknown";
  } catch (error) {
    console.error("Error extracting user ID from token:", error);
    return "unknown";
  }
}

// Export function to manually invalidate JWT (for logout)
export function invalidateJWT(jti: string) {
  JWTBlacklist.add(jti);
  console.log("Manually invalidated JWT:", jti);
}

// Export function to clear blacklist (for testing)
export function clearJWTBlacklist() {
  JWTBlacklist.clear();
}
