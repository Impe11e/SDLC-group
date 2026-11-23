import { request, tokenStorage } from './api';

interface LoginResponse {
    token: string;
}

export const authService = {
    async login(login: string, password: string): Promise<void> {
        const data = await request<LoginResponse>('POST', '/auth/login', {
            login,
            email: login,
            password,
        });
        tokenStorage.set(data.token);
    },

    async register(nickname: string, email: string, password: string): Promise<void> {
        await request('POST', '/auth/register', { nickname, email, password });
    },

    logout(): void {
        tokenStorage.clear();
    },

    isLoggedIn(): boolean {
        return tokenStorage.get() !== null;
    },
};