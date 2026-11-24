import type { UserProfile } from '../types/user';
import { request } from './api';

export const userService = {
    getMe: () => request<UserProfile>('GET', '/users/me'),

    updateNickname: (nickname: string) => request<UserProfile>('PATCH', '/users/me', { nickname }),
};
