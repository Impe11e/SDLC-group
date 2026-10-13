import type { UpdateNameInput } from '../../types/user.js';

export function validateUpdateName(data: Partial<UpdateNameInput>): string | null {
    if (!data.nickname || data.nickname.length < 3) return 'Nickname must be at least 3 characters';
    if (data.nickname.length > 30) return 'Nickname must be at most 30 characters';
    return null;
}
