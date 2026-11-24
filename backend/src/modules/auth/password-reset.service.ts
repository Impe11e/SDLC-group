import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { IEmailSender } from '../../adapters/email.adapter.js';
import { badRequest } from '../../errors/http-error.js';
import type { IAuthRepository, IPasswordResetRepository } from '../../types/auth.js';

const TOKEN_TTL_MS = 30 * 60 * 1000;
const SALT_ROUNDS = 10;

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export class PasswordResetService {
    private readonly users: IAuthRepository;
    private readonly resets: IPasswordResetRepository;
    private readonly email: IEmailSender;
    private readonly appUrl: string;

    constructor(
        users: IAuthRepository,
        resets: IPasswordResetRepository,
        email: IEmailSender,
        appUrl: string
    ) {
        this.users = users;
        this.resets = resets;
        this.email = email;
        this.appUrl = appUrl;
    }

    async requestReset(email: string): Promise<void> {
        const user = await this.users.findByEmail(email.trim().toLowerCase());
        if (!user) return;

        const token = randomBytes(32).toString('hex');
        await this.resets.create(user.id, hashToken(token), new Date(Date.now() + TOKEN_TTL_MS));
        await this.email.sendPasswordReset(
            user.email,
            `${this.appUrl}/reset-password?token=${token}`
        );
    }

    async resetPassword(token: string, password: string): Promise<void> {
        const record = await this.resets.findValid(hashToken(token));
        if (!record) throw badRequest('Посилання недійсне або застаріло');

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        await this.resets.consume(record.id, record.userId, passwordHash);
    }
}
