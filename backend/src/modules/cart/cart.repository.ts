import { pool } from '../../db/pool.js';
import type { CartItem, ICartRepository } from '../../types/cart.js';

const SELECT_CART_ITEM = `
    SELECT c.product_id      AS "productId",
           p.name            AS "productName",
           p.price::float8   AS price,
           c.quantity,
           p.stock
    FROM cart_items c
    JOIN products p ON p.id = c.product_id
`;

export class PgCartRepository implements ICartRepository {
    async findByUserId(userId: number): Promise<CartItem[]> {
        const { rows } = await pool.query<CartItem>(
            `${SELECT_CART_ITEM} WHERE c.user_id = $1 ORDER BY c.added_at, c.product_id`,
            [userId]
        );
        return rows;
    }

    async findItem(userId: number, productId: number): Promise<CartItem | null> {
        const { rows } = await pool.query<CartItem>(
            `${SELECT_CART_ITEM} WHERE c.user_id = $1 AND c.product_id = $2`,
            [userId, productId]
        );
        return rows[0] ?? null;
    }

    async setQuantity(userId: number, productId: number, quantity: number): Promise<void> {
        await pool.query(
            `INSERT INTO cart_items (user_id, product_id, quantity)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity`,
            [userId, productId, quantity]
        );
    }

    async removeItem(userId: number, productId: number): Promise<boolean> {
        const { rowCount } = await pool.query(
            'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );
        return (rowCount ?? 0) > 0;
    }

    async clear(userId: number): Promise<void> {
        await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    }
}
