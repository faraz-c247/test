// Subscription Plan Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  credits: number;
  expirationMonths: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// User Credits Types
export interface UserCredits {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  expirationDate: string | null;
  totalAmount: number;
  activePackages: UserCreditsPackage[];
}

export interface UserCreditsPackage {
  id: string;
  planId: string;
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  purchaseDate: string;
  expirationDate: string | null;
  status: "active" | "expired" | "exhausted";
}

// Promo Code Types
export interface PromoCodeDiscount {
  type: "percentage" | "fixed";
  value: number;
  amount?: number;
}

export interface PromoCodeValidation {
  valid: boolean;
  discount?: PromoCodeDiscount;
  error?: string;
}

// Payment Types
export interface PaymentFormData {
  planId: string;
  amount: number;
  originalAmount?: number;
  promoCode?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  finalPrice?: number;
  discount?: PromoCodeDiscount;
}

// Component Props Types
export interface PaymentFormProps {
  selectedPlan: SubscriptionPlan;
  onSuccess: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

// API Error Type
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Form Data Types
export interface PromoCodeFormData {
  promoCode?: string;
}
