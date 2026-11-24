import type { LoginInput, RegisterInput } from '../../types/auth.js';

export function validateRegister(data: Partial<RegisterInput>): string | null {
    if (!data.nickname || data.nickname.trim().length < 3) {
        return 'Нікнейм має містити щонайменше 3 символи';
    }
    if (data.nickname.trim().length > 30) return 'Нікнейм занадто довгий (максимум 30 символів)';
    if (!data.email || !data.email.includes('@')) return 'Некоректний email';
    if (!data.password || data.password.length < 8) {
        return 'Пароль має містити щонайменше 8 символів';
    }
    return null;
}

export function validateLogin(data: Partial<LoginInput>): string | null {
    if (!data.login || !data.password) return 'Вкажіть логін і пароль';
    return null;
}
