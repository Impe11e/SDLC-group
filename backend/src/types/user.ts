export interface UserProfile {
    id: number;
    nickname: string;
    email: string;
}

export interface IUserRepository {
    findById(id: number): Promise<UserProfile | null>;
    updateNickname(id: number, nickname: string): Promise<UserProfile | null>;
}

export interface UpdateNameInput {
    nickname: string;
}
