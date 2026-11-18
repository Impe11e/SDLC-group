import { pool } from '../../db/pool.js';
import type { IProductRepository, Product } from '../../types/product.js';

// price::float8 — pg повертає NUMERIC як рядок, тому приводимо до числа в SQL
const SELECT_PRODUCT = `
    SELECT id, name, description, category, price::float8 AS price, stock
    FROM products
`;

export class PgProductRepository implements IProductRepository {
    async findAll(): Promise<Product[]> {
        const { rows } = await pool.query<Product>(`${SELECT_PRODUCT} ORDER BY id`);
        return rows;
    }

    async findById(id: number): Promise<Product | null> {
        const { rows } = await pool.query<Product>(`${SELECT_PRODUCT} WHERE id = $1`, [id]);
        return rows[0] ?? null;
    }
}
