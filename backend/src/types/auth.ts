export interface User {
    id: number;
    nickname: string;
    email: string;
    passwordHash: string;
}

export interface IAuthRepository {
    findByEmail(email: string): Promise<User | null>;
    create(nickname: string, email: string, passwordHash: string): Promise<User>;
}

export interface RegisterInput {
    nickname: string;
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}
