import { pool } from '../../db/pool.js';
import type { IAuthRepository, User } from '../../types/auth.js';

const SELECT_USER = `
    SELECT id, nickname, email, password_hash AS "passwordHash", role
    FROM users
`;

export class PgAuthRepository implements IAuthRepository {
    async findByEmail(email: string): Promise<User | null> {
        const { rows } = await pool.query<User>(`${SELECT_USER} WHERE email = $1`, [
            email.toLowerCase(),
        ]);
        return rows[0] ?? null;
    }

    async findByNickname(nickname: string): Promise<User | null> {
        const { rows } = await pool.query<User>(
            `${SELECT_USER} WHERE LOWER(nickname) = LOWER($1)`,
            [nickname]
        );
        return rows[0] ?? null;
    }

    async findByLogin(login: string): Promise<User | null> {
        const { rows } = await pool.query<User>(
            `${SELECT_USER} WHERE email = LOWER($1) OR LOWER(nickname) = LOWER($1) LIMIT 1`,
            [login]
        );
        return rows[0] ?? null;
    }

    async create(nickname: string, email: string, passwordHash: string): Promise<User> {
        const { rows } = await pool.query<User>(
            `INSERT INTO users (nickname, email, password_hash)
             VALUES ($1, LOWER($2), $3)
             RETURNING id, nickname, email, password_hash AS "passwordHash", role`,
            [nickname, email, passwordHash]
        );
        return rows[0];
    }
}
