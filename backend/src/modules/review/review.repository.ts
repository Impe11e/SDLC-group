import { pool } from '../../db/pool.js';
import type { IReviewRepository, Review, ReviewInput } from '../../types/review.js';

const SELECT_REVIEW = `
    SELECT r.id, r.product_id AS "productId", r.user_id AS "userId", u.nickname,
           r.rating, r.text, r.created_at AS "createdAt"
    FROM reviews r
    JOIN users u ON u.id = r.user_id
`;

export class PgReviewRepository implements IReviewRepository {
    async findByProduct(productId: number): Promise<Review[]> {
        const { rows } = await pool.query<Review>(
            `${SELECT_REVIEW} WHERE r.product_id = $1 ORDER BY r.created_at DESC`,
            [productId]
        );
        return rows;
    }

    async exists(productId: number, userId: number): Promise<boolean> {
        const { rowCount } = await pool.query(
            'SELECT 1 FROM reviews WHERE product_id = $1 AND user_id = $2',
            [productId, userId]
        );
        return (rowCount ?? 0) > 0;
    }

    async create(productId: number, userId: number, input: ReviewInput): Promise<Review> {
        const inserted = await pool.query<{ id: number }>(
            `INSERT INTO reviews (product_id, user_id, rating, text)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
            [productId, userId, input.rating, input.text]
        );
        const { rows } = await pool.query<Review>(`${SELECT_REVIEW} WHERE r.id = $1`, [
            inserted.rows[0].id,
        ]);
        return rows[0];
    }
}
