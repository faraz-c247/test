import apiClient from "@/lib/apiClient";
import { AxiosResponse } from "axios";

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export abstract class BaseService {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected async get<T>(endpoint: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.get(
        `${this.baseUrl}${endpoint}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `GET ${endpoint} failed`
      );
    }
  }

  protected async post<T, U = any>(endpoint: string, data: U): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.post(
        `${this.baseUrl}${endpoint}`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `POST ${endpoint} failed`
      );
    }
  }

  protected async put<T, U = any>(endpoint: string, data: U): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.put(
        `${this.baseUrl}${endpoint}`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `PUT ${endpoint} failed`
      );
    }
  }

  protected async patch<T, U = any>(endpoint: string, data: U): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.patch(
        `${this.baseUrl}${endpoint}`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `PATCH ${endpoint} failed`
      );
    }
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.delete(
        `${this.baseUrl}${endpoint}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `DELETE ${endpoint} failed`
      );
    }
  }

  protected async getPaginated<T>(
    endpoint: string,
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<T>> {
    try {
      const response: AxiosResponse<PaginatedResponse<T>> = await apiClient.get(
        `${this.baseUrl}${endpoint}`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `GET ${endpoint} failed`
      );
    }
  }
}
