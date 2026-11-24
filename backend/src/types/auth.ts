export type UserRole = 'USER' | 'ADMIN';

export interface User {
    id: number;
    nickname: string;
    email: string;
    passwordHash: string;
    role: UserRole;
}

export interface IAuthRepository {
    findByEmail(email: string): Promise<User | null>;
    findByNickname(nickname: string): Promise<User | null>;
    findByLogin(login: string): Promise<User | null>;
    create(nickname: string, email: string, passwordHash: string): Promise<User>;
}

export interface RegisterInput {
    nickname: string;
    email: string;
    password: string;
}

export interface LoginInput {
    login: string;
    password: string;
}
