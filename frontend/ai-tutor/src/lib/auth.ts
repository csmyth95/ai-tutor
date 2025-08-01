// Authentication utility functions for external API integration
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
      id: string;
      email: string;
      name?: string;
    };
}

export interface User {
    id: string;
    email: string;
    name?: string;
}

// Store auth token in localStorage
export const setAuthToken = (token: string): void => {
    localStorage.setItem('auth_token', token);
};

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
    return localStorage.getItem('auth_token');
};

// Remove auth token
export const removeAuthToken = (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
};

// Store user data
export const setUserData = (user: User): void => {
    localStorage.setItem('user_data', JSON.stringify(user));
};

// Get user data
export const getUserData = (): User | null => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    const token = getAuthToken();
    return !!token;
};

// Login function - replace with your API endpoint
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`YOUR_API_ENDPOINT/api/v1/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }
    // TODO Decide on AuthResponse structure. Figure out how this integrates with the app.
    const data: AuthResponse = await response.json();
    
    // Store token and user data
    setAuthToken(data.token);
    setUserData(data.user);
    
    return data;
};

// Logout function - TODO Create backend for this
export const logout = async (): Promise<void> => {
    const token = getAuthToken();
    if (token) {
      try {
        // Optional: Call logout endpoint to invalidate token on server
        await fetch('YOUR_API_ENDPOINT/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }
    
    // Clear local storage
    removeAuthToken();
};

// Make authenticated API calls
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };
  
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If token is invalid, clear auth data
    if (response.status === 401) {
      removeAuthToken();
      throw new Error('Authentication token expired');
    }
    return response;
};
