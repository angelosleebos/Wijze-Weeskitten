// Helper functions for making authenticated API requests

export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('admin_token');
  const csrfToken = localStorage.getItem('csrf_token');
  
  if (!token) {
    return {
      'Content-Type': 'application/json',
    };
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
  
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }
  
  return headers;
}

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
  
  // Handle unauthorized responses
  if (response.status === 401) {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('csrf_token');
    window.location.href = '/admin';
  }
  
  return response;
}
