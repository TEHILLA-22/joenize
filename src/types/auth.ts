export interface User {
  id: string;
  email: string;
  username: string;
  is_seller: boolean;
  is_buyer: boolean;
  business_name?: string;
  business_type?: string;
  business_address?: string;
  tax_id?: string;
  phone_number?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh_token: string;
}

export interface GoogleLoginRequest {
  credential: string;
}

export interface GoogleLoginResponse {
  access: string;
  refresh_token?: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  detail: string;
}
