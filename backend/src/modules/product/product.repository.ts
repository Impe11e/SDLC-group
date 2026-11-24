import { conflict } from '../../errors/http-error.js';
import { pool } from '../../db/pool.js';
import type { IProductRepository, Product, ProductInput } from '../../types/product.js';

const PRODUCT_COLUMNS = `
    id, name, description, category, price::float8 AS price, stock,
    manufacturer, composition, image_url AS "imageUrl"
`;

const SELECT_PRODUCT = `SELECT ${PRODUCT_COLUMNS} FROM products`;

export class PgProductRepository implements IProductRepository {
    async findAll(): Promise<Product[]> {
        const { rows } = await pool.query<Product>(`${SELECT_PRODUCT} ORDER BY id`);
        return rows;
    }

    async findById(id: number): Promise<Product | null> {
        const { rows } = await pool.query<Product>(`${SELECT_PRODUCT} WHERE id = $1`, [id]);
        return rows[0] ?? null;
    }

    async create(input: ProductInput): Promise<Product> {
        const { rows } = await pool.query<Product>(
            `INSERT INTO products
                (name, description, category, price, stock, manufacturer, composition, image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING ${PRODUCT_COLUMNS}`,
            [
                input.name,
                input.description,
                input.category,
                input.price,
                input.stock,
                input.manufacturer,
                input.composition,
                input.imageUrl,
            ]
        );
        return rows[0];
    }

    async update(id: number, input: ProductInput): Promise<Product | null> {
        const { rows } = await pool.query<Product>(
            `UPDATE products
             SET name = $1, description = $2, category = $3, price = $4, stock = $5,
                 manufacturer = $6, composition = $7, image_url = $8
             WHERE id = $9
             RETURNING ${PRODUCT_COLUMNS}`,
            [
                input.name,
                input.description,
                input.category,
                input.price,
                input.stock,
                input.manufacturer,
                input.composition,
                input.imageUrl,
                id,
            ]
        );
        return rows[0] ?? null;
    }

    async remove(id: number): Promise<boolean> {
        try {
            const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
            return (rowCount ?? 0) > 0;
        } catch (err) {
            if ((err as { code?: string }).code === '23503') {
                throw conflict('Товар є в замовленнях, його не можна видалити');
            }
            throw err;
        }
    }
}
