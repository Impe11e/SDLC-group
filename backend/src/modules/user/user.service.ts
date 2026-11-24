import { conflict, notFound } from '../../errors/http-error.js';
import type { IUserRepository } from '../../types/user.js';

export class UserService {
    private readonly repo: IUserRepository;

    constructor(repo: IUserRepository) {
        this.repo = repo;
    }

    async getProfile(id: number) {
        const user = await this.repo.findById(id);
        if (!user) throw notFound('Користувача не знайдено');
        return user;
    }

    async updateName(id: number, nickname: string) {
        const cleanNickname = nickname.trim();
        if (await this.repo.isNicknameTaken(cleanNickname, id)) {
            throw conflict('Цей нікнейм уже зайнятий');
        }
        const user = await this.repo.updateNickname(id, cleanNickname);
        if (!user) throw notFound('Користувача не знайдено');
        return user;
    }
}
