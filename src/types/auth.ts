export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'VOLUNTEER' | 'COORDINATOR' | 'ADMIN';
  ongId: string;
  ongName: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  ongId?: string;
  rememberMe?: boolean;
}

export interface AuthValidationResult {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
    general?: string;
  };
}
