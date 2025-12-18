/**
 * API Configuration Utility
 * Centralized API base URL management using environment variables
 */

const getApiBaseUrl = (): string => {
  // In browser/client-side, use NEXT_PUBLIC_ prefix
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  }
  
  // Server-side rendering
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * API endpoint helpers
 */
export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/api/products`,
  productById: (id: string) => `${API_BASE_URL}/api/products/${id}`,
  categories: `${API_BASE_URL}/api/categories`,
  categoryById: (id: string) => `${API_BASE_URL}/api/categories/${id}`,
  users: `${API_BASE_URL}/api/users`,
  userById: (id: string) => `${API_BASE_URL}/api/users/${id}`,
  userByUid: (uid: string) => `${API_BASE_URL}/api/users/uid/${uid}`,
  userDisable: (id: string) => `${API_BASE_URL}/api/users/${id}/disable`,
  userEnable: (id: string) => `${API_BASE_URL}/api/users/${id}/enable`,
  upload: `${API_BASE_URL}/api/upload`,
} as const;

/**
 * Fetch wrapper with error handling
 */
export const apiFetch = async (
  endpoint: string,
  options?: RequestInit
): Promise<Response> => {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response;
};

