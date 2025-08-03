// User data returned by the API on successful registration/login
interface User {
  id: string;
}

// Response format for successful registration
interface RegisterResponse {
  user: User;
  message?: string;
}

interface LoginResponse {
  user: User;
  token: string;
  message?: string;
}

export type {
  User,
  RegisterResponse,
  LoginResponse,
};
