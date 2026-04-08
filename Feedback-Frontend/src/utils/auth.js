// src/utils/auth.js

const CURRENT_USER_KEY = 'sfh_current_user';
const TOKEN_KEY = 'sfh_token';
const LOGIN_TIMESTAMP_KEY = 'sfh_login_at';
const SESSION_DURATION_MS = 60 * 1000;

const isSessionExpired = () => {
    const loginTimestamp = localStorage.getItem(LOGIN_TIMESTAMP_KEY);
    if (!loginTimestamp) {
        return true;
    }

    const loginTime = Number(loginTimestamp);
    if (!Number.isFinite(loginTime)) {
        return true;
    }

    return Date.now() - loginTime > SESSION_DURATION_MS;
};

export const saveAuthSession = (user, token) => {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());
};

export const logoutUser = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
};

export const getCurrentUser = () => {
    if (isSessionExpired()) {
        logoutUser();
        return null;
    }

    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
    if (isSessionExpired()) {
        logoutUser();
        return false;
    }

    return !!getCurrentUser() && !!localStorage.getItem(TOKEN_KEY);
};

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const getAllUsers = () => {
    const users = localStorage.getItem('sfh_users');
    return users ? JSON.parse(users) : [];
};
