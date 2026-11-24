export interface UserProfile {
    id: number;
    nickname: string;
    email: string;
}

export interface IUserRepository {
    findById(id: number): Promise<UserProfile | null>;
    isNicknameTaken(nickname: string, exceptUserId: number): Promise<boolean>;
    updateNickname(id: number, nickname: string): Promise<UserProfile | null>;
}

export interface UpdateNameInput {
    nickname: string;
}
