/**
 * API Utility - Centralized API calls with automatic token handling
 * 
 * This file handles all API requests to the backend.
 * It automatically includes the JWT token in the Authorization header.
 */

const API_BASE_URL = 'http://localhost:5000';

/**
 * Get the stored token from localStorage
 */
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Make an authenticated API request
 * Automatically includes the JWT token in headers
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login if we're in browser
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please login again.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// ============================================
// USER API
// ============================================

export const userAPI = {
  /**
   * Register a new user
   * POST /users
   */
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    return data;
  },

  /**
   * Login user
   * POST /users/login
   * Returns: { token, user }
   */
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    return data; // { token, user }
  },
};

// ============================================
// ASSIGNMENTS API
// ============================================

export const assignmentsAPI = {
  /**
   * Get all assignments for current user
   * GET /assignments
   */
  getAll: async () => {
    return apiRequest('/assignments');
  },

  /**
   * Get single assignment by ID
   * GET /assignments/:id
   */
  getById: async (id) => {
    return apiRequest(`/assignments/${id}`);
  },

  /**
   * Create new assignment
   * POST /assignments
   */
  create: async (assignmentData) => {
    return apiRequest('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignmentData),
    });
  },

  /**
   * Update assignment
   * PUT /assignments/:id
   */
  update: async (id, assignmentData) => {
    return apiRequest(`/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    });
  },

  /**
   * Delete assignment
   * DELETE /assignments/:id
   */
  delete: async (id) => {
    return apiRequest(`/assignments/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// TASKS API
// ============================================

export const tasksAPI = {
  /**
   * Get all tasks for current user
   * GET /tasks
   */
  getAll: async () => {
    return apiRequest('/tasks');
  },

  /**
   * Create new task
   * POST /tasks
   */
  create: async (taskData) => {
    return apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Update task (mark complete/incomplete)
   * PUT /tasks/:id
   */
  update: async (id, taskData) => {
    return apiRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Delete task
   * DELETE /tasks/:id
   */
  delete: async (id) => {
    return apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// JOBS API
// ============================================

export const jobsAPI = {
  /**
   * Get all job applications for current user
   * GET /jobs
   */
  getAll: async () => {
    return apiRequest('/jobs');
  },

  /**
   * Create new job application
   * POST /jobs
   */
  create: async (jobData) => {
    return apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  /**
   * Update job application
   * PUT /jobs/:id
   */
  update: async (id, jobData) => {
    return apiRequest(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  },

  /**
   * Delete job application
   * DELETE /jobs/:id
   */
  delete: async (id) => {
    return apiRequest(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },
};

