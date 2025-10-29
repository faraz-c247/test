export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: number; // 1 = admin, 2 = user
  createdAt: Date;
}

export interface UserWithoutPassword {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  role: number; // 1 = admin, 2 = user
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}
