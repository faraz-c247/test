import { BaseService, PaginatedResponse } from "./baseService";

// Request Types
export interface PropertyAnalysisRequest {
  userId?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  propertyDetails: {
    propertyType: "apartment" | "house" | "condo" | "townhouse" | "studio";
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    yearBuilt?: number;
    amenities?: string[];
  };
  reportType: "single" | "pro" | "enterprise";
}

export interface QuickEstimateRequest {
  address: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
}

// Response Types
export interface PropertyAnalysisResponse {
  success: boolean;
  message: string;
  data?: {
    propertyId: string;
    reportId: string;
    status: string;
    estimatedRent: {
      min: number;
      max: number;
      recommended: number;
    };
    confidence: number;
    reportUrl?: string;
  };
}

export interface QuickEstimateResponse {
  success: boolean;
  message: string;
  data?: {
    estimatedRent: {
      min: number;
      max: number;
      recommended: number;
    };
    confidence: number;
    marketData: any;
  };
}

export interface Property {
  id: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  propertyDetails: {
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    yearBuilt?: number;
    amenities?: string[];
  };
  marketAnalysis: {
    estimatedRent: {
      min: number;
      max: number;
      recommended: number;
    };
    confidence: number;
  };
  reportData: {
    reportId: string;
    generatedAt?: Date;
  };
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyReport {
  success: boolean;
  message: string;
  data?: {
    property: {
      address: any;
      propertyDetails: any;
    };
    marketAnalysis: any;
    reportData: any;
    subscription: any;
  };
}

export interface MarketInsights {
  success: boolean;
  message: string;
  data?: any;
}

class PropertyService extends BaseService {
  constructor() {
    super("/properties");
  }

  /**
   * Create a new property analysis
   */
  async createPropertyAnalysis(
    data: PropertyAnalysisRequest
  ): Promise<PropertyAnalysisResponse> {
    return this.post<PropertyAnalysisResponse, PropertyAnalysisRequest>(
      "/analyze",
      data
    );
  }

  /**
   * Get quick rent estimate (no full analysis)
   */
  async getQuickEstimate(
    data: QuickEstimateRequest
  ): Promise<QuickEstimateResponse> {
    return this.post<QuickEstimateResponse, QuickEstimateRequest>(
      "/quick-estimate",
      data
    );
  }

  /**
   * Get user's property analyses with pagination
   */
  async getUserProperties(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      properties: Property[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
  }> {
    return this.get(`/?page=${page}&limit=${limit}`);
  }

  /**
   * Get property analysis by ID
   */
  async getPropertyAnalysis(
    propertyId: string
  ): Promise<PropertyAnalysisResponse> {
    return this.get<PropertyAnalysisResponse>(`/analysis/${propertyId}`);
  }

  /**
   * Get property report by report ID
   */
  async getPropertyReport(reportId: string): Promise<PropertyReport> {
    return this.get<PropertyReport>(`/report/${reportId}`);
  }

  /**
   * Get market insights for a location
   */
  async getMarketInsights(zipCode: string): Promise<MarketInsights> {
    return this.get<MarketInsights>(`/market-insights/${zipCode}`);
  }

  /**
   * Delete property analysis
   */
  async deletePropertyAnalysis(propertyId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.delete(`/analysis/${propertyId}`);
  }

  /**
   * Poll analysis status until completion
   */
  async pollAnalysisStatus(
    propertyId: string
  ): Promise<PropertyAnalysisResponse> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const response = await this.getPropertyAnalysis(propertyId);

          if (
            response.data?.status === "completed" ||
            response.data?.status === "failed"
          ) {
            resolve(response);
          } else {
            setTimeout(poll, 3000); // Poll every 3 seconds
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }
}

export const propertyService = new PropertyService();
export default propertyService;
