const API_URL = "http://localhost:8080/api/events";
const AUTH_URL = "http://localhost:8080/api/auth";

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

async function handleResponse(response) {
  if (!response.ok) {
    let message = `Request failed (${response.status}).`;

    try {
      const data = await response.json();
      if (data.message) message = data.message;
      else if (data.detail) message = data.detail;
    } catch {
      // Use the default message if the response is not JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) return null;

  return response.json();
}

async function apiRequest(url, options = {}) {
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return handleResponse(response);
}

// Authentication
export async function registerUser(name, email, password) {
  return apiRequest(`${AUTH_URL}/register`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser(email, password) {
  return apiRequest(`${AUTH_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUser() {
  return apiRequest(`${AUTH_URL}/me`);
}

// Events
export async function getEvents() {
  return apiRequest(API_URL);
}

export async function getEventById(id) {
  return apiRequest(`${API_URL}/${id}`);
}

export async function createEvent(event) {
  return apiRequest(API_URL, {
    method: "POST",
    body: JSON.stringify(event),
  });
}

export async function updateEvent(id, event) {
  return apiRequest(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(event),
  });
}

export async function deleteEvent(id) {
  return apiRequest(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}