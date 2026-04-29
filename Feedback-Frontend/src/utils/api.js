const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
const TOKEN_KEY = 'sfh_token';

const authHeaders = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : null;
    if (!response.ok) {
        const message = data?.message || data?.error || response.statusText || 'Request failed';
        throw new Error(message);
    }
    return data;
};

export const registerUser = async ({ fullName, email, password, role, department }) => { 
    const roleId = role === 'admin' ? 1 : 0;
    const response = await fetch(`${API_BASE}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password, role: roleId, department })
    });
    return handleResponse(response);
};

export const loginUser = async ({ email, password }) => {
    const response = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
};

export const fetchCurrentUser = async () => {
    const response = await fetch(`${API_BASE}/api/users/me`, {
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
        }
    });
    return handleResponse(response);
};

export const getCourses = async () => {
    const response = await fetch(`${API_BASE}/api/courses`, {
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
        }
    });
    return handleResponse(response);
};

export const getCourseById = async (id) => {
    const response = await fetch(`${API_BASE}/api/courses/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
        }
    });
    return handleResponse(response);
};

export const createCourse = async (course) => {
    const response = await fetch(`${API_BASE}/api/courses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
        },
        body: JSON.stringify(course)
    });
    return handleResponse(response);
};

export const updateCourse = async (id, course) => {
    const response = await fetch(`${API_BASE}/api/courses/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
        },
        body: JSON.stringify(course)
    });
    return handleResponse(response);
};

export const deleteCourse = async (id) => {
    const response = await fetch(`${API_BASE}/api/courses/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
    });
    if (!response.ok) {
        throw new Error('Failed to delete course');
    }
    return true;
};

export const getAllFeedback = async () => {
    const response = await fetch(`${API_BASE}/api/feedback`, {
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
        }
    });
    return handleResponse(response);
};

export const getStudentFeedback = async (studentId) => {
    const response = await fetch(`${API_BASE}/api/feedback/student/${studentId}`, {
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
        }
    });
    return handleResponse(response);
};

export const getPendingCourses = async (studentId) => {
    const response = await fetch(`${API_BASE}/api/feedback/pending/${studentId}`, {
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
        }
    });
    return handleResponse(response);
};

export const getAnalytics = async () => {
    const response = await fetch(`${API_BASE}/api/feedback/analytics`, {
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
        }
    });
    return handleResponse(response);
};

export const submitFeedback = async (feedback) => {
    const response = await fetch(`${API_BASE}/api/feedback`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
        },
        body: JSON.stringify(feedback)
    });
    return handleResponse(response);
};

export const getAllUsers = async () => {
    const response = await fetch(`${API_BASE}/api/users`, {
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
        }
    });
    return handleResponse(response);
};

export const getUserById = async (id) => {
    const response = await fetch(`${API_BASE}/api/users/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
        }
    });
    return handleResponse(response);
};

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
