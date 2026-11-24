import bcrypt from 'bcryptjs';
import { conflict, HttpError } from '../../errors/http-error.js';
import type { IAuthRepository } from '../../types/auth.js';
import { signToken } from './token.js';

const SALT_ROUNDS = 10;

export class AuthService {
    private readonly repo: IAuthRepository;

    constructor(repo: IAuthRepository) {
        this.repo = repo;
    }

    async register(nickname: string, email: string, password: string) {
        const cleanNickname = nickname.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (await this.repo.findByEmail(cleanEmail)) {
            throw conflict('Користувач з таким email уже існує');
        }
        if (await this.repo.findByNickname(cleanNickname)) {
            throw conflict('Цей нікнейм уже зайнятий');
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        return this.repo.create(cleanNickname, cleanEmail, passwordHash);
    }

    async login(login: string, password: string): Promise<string> {
        const user = await this.repo.findByLogin(login.trim());
        const valid = user !== null && (await bcrypt.compare(password, user.passwordHash));
        if (!user || !valid) {
            throw new HttpError(401, 'Невірний логін або пароль');
        }
        return signToken({ sub: user.id, role: user.role });
    }
}
