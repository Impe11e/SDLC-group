import type { LoginInput, RegisterInput } from '../../types/auth.js';

export function validateRegister(data: Partial<RegisterInput>): string | null {
    if (!data.nickname || data.nickname.length < 3) return 'Nickname must be at least 3 characters';
    if (!data.email || !data.email.includes('@')) return 'Invalid email';
    if (!data.password || data.password.length < 8) return 'Password must be at least 8 characters';
    return null;
}

export function validateLogin(data: Partial<LoginInput>): string | null {
    if (!data.email || !data.password) return 'Email and password are required';
    return null;
}
