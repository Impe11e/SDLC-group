import type { IUserRepository } from '../../types/user.js';

export class UserService {
    private readonly repo: IUserRepository;

    constructor(repo: IUserRepository) {
        this.repo = repo;
    }

    async getProfile(id: number) {
        const user = await this.repo.findById(id);
        if (!user) throw new Error('User not found');
        return user;
    }

    async updateName(id: number, nickname: string) {
        const user = await this.repo.updateNickname(id, nickname);
        if (!user) throw new Error('User not found');
        return user;
    }
}
