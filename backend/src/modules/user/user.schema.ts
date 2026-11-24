import type { UpdateNameInput } from '../../types/user.js';

export function validateUpdateName(data: Partial<UpdateNameInput>): string | null {
    if (typeof data.nickname !== 'string') return 'Вкажіть нікнейм';
    const nickname = data.nickname.trim();
    if (nickname.length < 3) return 'Нікнейм має містити щонайменше 3 символи';
    if (nickname.length > 30) return 'Нікнейм занадто довгий (максимум 30 символів)';
    return null;
}
