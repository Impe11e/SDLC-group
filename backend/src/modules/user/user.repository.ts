import { pool } from '../../db/pool.js';
import type { IUserRepository, UserProfile } from '../../types/user.js';

export class PgUserRepository implements IUserRepository {
    async findById(id: number): Promise<UserProfile | null> {
        const { rows } = await pool.query<UserProfile>(
            'SELECT id, nickname, email FROM users WHERE id = $1',
            [id]
        );
        return rows[0] ?? null;
    }

    async isNicknameTaken(nickname: string, exceptUserId: number): Promise<boolean> {
        const { rowCount } = await pool.query(
            'SELECT 1 FROM users WHERE LOWER(nickname) = LOWER($1) AND id <> $2',
            [nickname, exceptUserId]
        );
        return (rowCount ?? 0) > 0;
    }

    async updateNickname(id: number, nickname: string): Promise<UserProfile | null> {
        const { rows } = await pool.query<UserProfile>(
            'UPDATE users SET nickname = $1 WHERE id = $2 RETURNING id, nickname, email',
            [nickname, id]
        );
        return rows[0] ?? null;
    }
}
