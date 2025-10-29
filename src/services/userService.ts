import { BaseService, PaginatedResponse } from "./baseService";

// User Types
export interface CreateUserRequest {
  name: string;
  email: string;
  phoneNumber?: string;
  countryCode?: string;
  role?: number;
  status?: number;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  countryCode?: string;
  role?: number;
  status?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: number;
  status: number;
  phoneNumber?: string;
  countryCode?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface ChangeStatusRequest {
  status: number;
}

class UserService extends BaseService {
  constructor() {
    super("/user");
  }

  /**
   * Get all users with pagination and search
   */
  async getUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    orderBy?: string
  ): Promise<UsersResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (search) params.append("search", search);
    if (sortBy) params.append("sortBy", sortBy);
    if (orderBy) params.append("orderBy", orderBy);

    return this.get<UsersResponse>(`?${params.toString()}`);
  }

  /**
   * Get a specific user by ID
   */
  async getUserById(userId: string): Promise<UserResponse> {
    return this.get<UserResponse>(`/${userId}`);
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    return this.post<UserResponse, CreateUserRequest>("/", userData);
  }

  /**
   * Update an existing user
   */
  async updateUser(
    userId: string,
    userData: UpdateUserRequest
  ): Promise<UserResponse> {
    return this.put<UserResponse, UpdateUserRequest>(`/${userId}`, userData);
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<DeleteUserResponse> {
    return this.delete<DeleteUserResponse>(`/${userId}`);
  }

  /**
   * Change user status (activate/deactivate)
   */
  async changeUserStatus(
    userId: string,
    status: number
  ): Promise<UserResponse> {
    return this.put<UserResponse, ChangeStatusRequest>(
      `/change-status/${userId}`,
      { status }
    );
  }

  /**
   * Set user password (for password reset)
   */
  async setPassword(
    token: string,
    password: string
  ): Promise<{
    success: boolean;
    message: string;
    data: any;
  }> {
    return this.post("/set-password", { token, password });
  }
}

export const userService = new UserService();
export default userService;
