// Helper functions for making authenticated API requests

export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('admin_token');
  
  if (!token) {
    return {
      'Content-Type': 'application/json',
    };
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = getAuthHeaders();
  
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}
