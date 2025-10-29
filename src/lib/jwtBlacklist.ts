// JWT Blacklist Management Utility
// This utility provides functions to manage the JWT blacklist for debugging and manual operations

export class JWTBlacklistManager {
  private static readonly STORAGE_KEY = "nextauth-jwt-blacklist";
  private static readonly MAX_ENTRIES = 1000;

  /**
   * Get all blacklisted JWT IDs
   */
  static getAll(): string[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn("Failed to load JWT blacklist:", error);
      return [];
    }
  }

  /**
   * Check if a JWT ID is blacklisted
   */
  static isBlacklisted(jti: string): boolean {
    const blacklist = this.getAll();
    return blacklist.includes(jti);
  }

  /**
   * Add a JWT ID to the blacklist
   */
  static add(jti: string): void {
    const blacklist = new Set(this.getAll());
    blacklist.add(jti);
    this.save(Array.from(blacklist));
    console.log("Added to blacklist:", jti);
  }

  /**
   * Remove a JWT ID from the blacklist
   */
  static remove(jti: string): void {
    const blacklist = this.getAll().filter((id) => id !== jti);
    this.save(blacklist);
    console.log("Removed from blacklist:", jti);
  }

  /**
   * Clear all blacklisted JWT IDs
   */
  static clear(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log("JWT blacklist cleared");
    }
  }

  /**
   * Get blacklist statistics
   */
  static getStats(): {
    count: number;
    storageSize: string;
    oldestEntry?: string;
  } {
    const blacklist = this.getAll();
    const storageSize =
      typeof window !== "undefined"
        ? (localStorage.getItem(this.STORAGE_KEY)?.length || 0) + " characters"
        : "N/A";

    return {
      count: blacklist.length,
      storageSize,
      oldestEntry: blacklist[0],
    };
  }

  /**
   * Clean up old entries to prevent storage overflow
   */
  static cleanup(): void {
    const blacklist = this.getAll();
    if (blacklist.length > this.MAX_ENTRIES) {
      const recentEntries = blacklist.slice(
        -Math.floor(this.MAX_ENTRIES * 0.8)
      );
      this.save(recentEntries);
      console.log(
        `JWT blacklist cleaned up: ${blacklist.length} → ${recentEntries.length} entries`
      );
    }
  }

  /**
   * Export blacklist for backup
   */
  static export(): string {
    return JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        blacklist: this.getAll(),
        stats: this.getStats(),
      },
      null,
      2
    );
  }

  /**
   * Import blacklist from backup
   */
  static import(data: string): void {
    try {
      const parsed = JSON.parse(data);
      if (parsed.blacklist && Array.isArray(parsed.blacklist)) {
        this.save(parsed.blacklist);
        console.log(
          "JWT blacklist imported:",
          parsed.blacklist.length,
          "entries"
        );
      } else {
        throw new Error("Invalid blacklist format");
      }
    } catch (error) {
      console.error("Failed to import blacklist:", error);
      throw error;
    }
  }

  /**
   * Save blacklist to storage
   */
  private static save(blacklist: string[]): void {
    if (typeof window === "undefined") return;

    try {
      // Limit size to prevent storage overflow
      const limitedEntries = blacklist.slice(-this.MAX_ENTRIES);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedEntries));
    } catch (error) {
      console.warn("Failed to save JWT blacklist:", error);
    }
  }
}

// Browser console helpers (only available in development)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).jwtBlacklist = {
    getAll: () => JWTBlacklistManager.getAll(),
    isBlacklisted: (jti: string) => JWTBlacklistManager.isBlacklisted(jti),
    add: (jti: string) => JWTBlacklistManager.add(jti),
    remove: (jti: string) => JWTBlacklistManager.remove(jti),
    clear: () => JWTBlacklistManager.clear(),
    stats: () => JWTBlacklistManager.getStats(),
    cleanup: () => JWTBlacklistManager.cleanup(),
    export: () => JWTBlacklistManager.export(),
    import: (data: string) => JWTBlacklistManager.import(data),
  };

  console.log(
    "JWT Blacklist Manager available in console: window.jwtBlacklist"
  );
}
