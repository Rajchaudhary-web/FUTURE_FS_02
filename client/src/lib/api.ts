/**
 * Custom fetch wrapper to automatically inject the JWT token
 * and handle 401 Unauthorized errors globally.
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("jwt_token");
  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem("jwt_token");
    // Only redirect if we are not already on the login page
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  return response;
}
