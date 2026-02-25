// src/utils/auth.js

const USERS_KEY = 'sfh_users';
const CURRENT_USER_KEY = 'sfh_current_user';

export const registerUser = ({ fullName, email, password, role }) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

    if (users.find(u => u.email === email)) {
        throw new Error('User already exists with this email.');
    }

    const newUser = { id: Date.now().toString(), fullName, email, password, role };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
};

export const loginUser = ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        throw new Error('Invalid email or password.');
    }

    // Store only non-sensitive data in current user session
    const currentUser = { id: user.id, fullName: user.fullName, email: user.email, role: user.role };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    return currentUser;
};

export const logoutUser = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = () => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
    return !!getCurrentUser();
};

export const getAllUsers = () => {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
};
