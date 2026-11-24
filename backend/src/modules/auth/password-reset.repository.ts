import { pool } from '../../db/pool.js';
import type { IPasswordResetRepository } from '../../types/auth.js';

export class PgPasswordResetRepository implements IPasswordResetRepository {
    async create(userId: number, tokenHash: string, expiresAt: Date): Promise<void> {
        await pool.query(
            `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
             VALUES ($1, $2, $3)`,
            [userId, tokenHash, expiresAt]
        );
    }

    async findValid(tokenHash: string): Promise<{ id: number; userId: number } | null> {
        const { rows } = await pool.query<{ id: number; userId: number }>(
            `SELECT id, user_id AS "userId"
             FROM password_reset_tokens
             WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()`,
            [tokenHash]
        );
        return rows[0] ?? null;
    }

    async consume(id: number, userId: number, passwordHash: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
                passwordHash,
                userId,
            ]);
            await client.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1', [
                id,
            ]);
            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}
