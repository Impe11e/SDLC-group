import type { IAuthRepository } from '../../types/auth.js';

export class AuthService {
    private readonly repo: IAuthRepository;

    constructor(repo: IAuthRepository) {
        this.repo = repo;
    }

    async register(nickname: string, email: string, password: string) {
        if (await this.repo.findByEmail(email)) {
            throw new Error('User already exists');
        }
        return this.repo.create(nickname, email, password);
    }

    async login(email: string, password: string): Promise<string> {
        const user = await this.repo.findByEmail(email);
        if (!user || user.passwordHash !== password) {
            throw new Error('Invalid email or password');
        }
        return 'fake-jwt-token';
    }
}
