import type { PoolClient } from 'pg';
import { pool } from '../../db/pool.js';
import type { CartItem } from '../../types/cart.js';
import type {
    CreateOrderDTO,
    IOrderRepository,
    IOrderTransaction,
    Order,
    OrderItem,
} from '../../types/order.js';

const SELECT_ORDER = `
    SELECT id,
           user_id              AS "userId",
           full_name            AS "fullName",
           delivery_address     AS "deliveryAddress",
           payment_method       AS "paymentMethod",
           total_amount::float8 AS "totalAmount",
           status,
           created_at           AS "createdAt"
    FROM orders
`;

type OrderRow = Omit<Order, 'items'>;
type OrderItemRow = OrderItem & { orderId: number };

class PgOrderTransaction implements IOrderTransaction {
    private readonly client: PoolClient;

    constructor(client: PoolClient) {
        this.client = client;
    }

    async lockCartItems(userId: number): Promise<CartItem[]> {
        const { rows } = await this.client.query<CartItem>(
            `SELECT c.product_id    AS "productId",
                    p.name          AS "productName",
                    p.price::float8 AS price,
                    c.quantity,
                    p.stock
             FROM cart_items c
             JOIN products p ON p.id = c.product_id
             WHERE c.user_id = $1
             ORDER BY p.id
             FOR UPDATE OF c, p`,
            [userId]
        );
        return rows;
    }

    async createOrder(userId: number, dto: CreateOrderDTO, totalAmount: number): Promise<number> {
        const { rows } = await this.client.query<{ id: number }>(
            `INSERT INTO orders (user_id, full_name, delivery_address, payment_method, total_amount)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
            [userId, dto.fullName, dto.deliveryAddress, dto.paymentMethod, totalAmount]
        );
        return rows[0].id;
    }

    async addOrderItems(orderId: number, items: CartItem[]): Promise<void> {
        await this.client.query(
            `INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
             SELECT $1, * FROM unnest($2::int[], $3::text[], $4::numeric[], $5::int[])`,
            [
                orderId,
                items.map((i) => i.productId),
                items.map((i) => i.productName),
                items.map((i) => i.price),
                items.map((i) => i.quantity),
            ]
        );
    }

    async decreaseStock(items: CartItem[]): Promise<void> {
        await this.client.query(
            `UPDATE products p
             SET stock = p.stock - v.quantity
             FROM unnest($1::int[], $2::int[]) AS v(product_id, quantity)
             WHERE p.id = v.product_id`,
            [items.map((i) => i.productId), items.map((i) => i.quantity)]
        );
    }

    async clearCart(userId: number): Promise<void> {
        await this.client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    }
}

export class PgOrderRepository implements IOrderRepository {
    async withTransaction<T>(work: (tx: IOrderTransaction) => Promise<T>): Promise<T> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const result = await work(new PgOrderTransaction(client));
            await client.query('COMMIT');
            return result;
        } catch (err) {
            await client.query('ROLLBACK').catch(() => undefined);
            throw err;
        } finally {
            client.release();
        }
    }

    async findByUserId(userId: number): Promise<Order[]> {
        const { rows } = await pool.query<OrderRow>(
            `${SELECT_ORDER} WHERE user_id = $1 ORDER BY created_at DESC, id DESC`,
            [userId]
        );
        return this.attachItems(rows);
    }

    async findById(userId: number, orderId: number): Promise<Order | null> {
        const { rows } = await pool.query<OrderRow>(
            `${SELECT_ORDER} WHERE user_id = $1 AND id = $2`,
            [userId, orderId]
        );
        const [order] = await this.attachItems(rows);
        return order ?? null;
    }

    private async attachItems(orders: OrderRow[]): Promise<Order[]> {
        if (orders.length === 0) return [];

        const { rows: items } = await pool.query<OrderItemRow>(
            `SELECT order_id      AS "orderId",
                    product_id    AS "productId",
                    product_name  AS "productName",
                    price::float8 AS price,
                    quantity
             FROM order_items
             WHERE order_id = ANY($1)
             ORDER BY id`,
            [orders.map((o) => o.id)]
        );

        return orders.map((order) => ({
            ...order,
            items: items
                .filter((item) => item.orderId === order.id)
                .map(({ orderId: _orderId, ...item }) => item),
        }));
    }
}
