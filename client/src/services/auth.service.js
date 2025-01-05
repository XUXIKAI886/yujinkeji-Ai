import http from '../utils/http';

class AuthService {
    async login(email, password) {
        return http.post('/api/users/login', { email, password });
    }

    async register(email, password, username) {
        return http.post('/api/users/register', { email, password, username });
    }

    setAuthHeader(token) {
        if (token) {
            http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }

    removeAuthHeader() {
        delete http.defaults.headers.common['Authorization'];
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.removeAuthHeader();
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
}

const authService = new AuthService();
export default authService; 