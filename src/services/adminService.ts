import { BaseService } from "./baseService";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalReports: number;
  reportsToday: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalCredits: number;
  activeSubscriptions: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AllReportsResponse {
  success: boolean;
  data: {
    reports: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface AdminStatsResponse {
  success: boolean;
  data: AdminStats;
}

class AdminService extends BaseService {
  constructor() {
    super(""); // Use base URL since we're calling specific endpoints
  }

  // Get admin dashboard statistics (using new backend endpoint)
  async getAdminStats(): Promise<AdminStatsResponse> {
    const response = await this.get("/properties/admin/stats");
    return response;
  }

  // Get all users with pagination (using existing user endpoint)
  async getAllUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<UsersResponse> {
    const response = await this.get(`/user?page=${page}&limit=${limit}`);
    return response;
  }

  // Get all reports from all users (using new admin endpoint)
  async getAllReports(
    page: number = 1,
    limit: number = 10
  ): Promise<AllReportsResponse> {
    const response = await this.get(
      `/properties/admin/all?page=${page}&limit=${limit}`
    );
    return response;
  }

  // Get user details by ID (using existing user endpoint)
  async getUserById(userId: string): Promise<{ success: boolean; data: User }> {
    const response = await this.get(`/user/${userId}`);
    return response;
  }

  // Update user (admin action) - using existing user endpoint
  async updateUser(
    userId: string,
    userData: Partial<User>
  ): Promise<{ success: boolean; data: User }> {
    const response = await this.put(`/user/${userId}`, userData);
    return response;
  }

  // Delete user (admin action) - using existing user endpoint
  async deleteUser(
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await this.delete(`/user/${userId}`);
    return response;
  }

  // Change user status (admin action) - using existing user endpoint
  async changeUserStatus(
    userId: string,
    statusData: { isActive: boolean }
  ): Promise<{ success: boolean; data: User }> {
    const response = await this.put(
      `/user/change-status/${userId}`,
      statusData
    );
    return response;
  }

  // Create new user (admin action) - using existing user endpoint
  async createUser(
    userData: Partial<User>
  ): Promise<{ success: boolean; data: User }> {
    const response = await this.post(`/user`, userData);
    return response;
  }

  // Get system health and metrics (placeholder - no existing endpoint)
  async getSystemHealth(): Promise<{
    success: boolean;
    data: {
      uptime: string;
      systemHealth: string;
      dbStatus: string;
      apiResponseTime: number;
    };
  }> {
    // Return mock data since there's no system health endpoint yet
    return {
      success: true,
      data: {
        uptime: "99.9%",
        systemHealth: "Excellent",
        dbStatus: "Connected",
        apiResponseTime: 150,
      },
    };
  }
}

export const adminService = new AdminService();
export default adminService;
export type {
  AdminStats,
  User,
  AllReportsResponse,
  UsersResponse,
  AdminStatsResponse,
};
