import { badRequest, conflict, notFound } from '../../errors/http-error.js';
import type { CreateOrderDTO, IOrderRepository, Order } from '../../types/order.js';
import { calculateTotal } from '../cart/cart.service.js';
import { toCreateOrderDTO, validateCreateOrder } from './order.schema.js';

export class OrderService {
    private readonly repo: IOrderRepository;

    constructor(repo: IOrderRepository) {
        this.repo = repo;
    }

    async placeOrder(
        userId: number,
        input: Partial<Record<keyof CreateOrderDTO, unknown>>
    ): Promise<Order> {
        const error = validateCreateOrder(input);
        if (error) throw badRequest(error);
        const dto = toCreateOrderDTO(input as Record<keyof CreateOrderDTO, unknown>);

        const orderId = await this.repo.withTransaction(async (tx) => {
            const items = await tx.lockCartItems(userId);
            if (items.length === 0) {
                throw badRequest('Кошик порожній, неможливо оформити замовлення');
            }

            const unavailable = items.filter((item) => item.quantity > item.stock);
            if (unavailable.length > 0) {
                const details = unavailable
                    .map((i) => `"${i.productName}" (доступно: ${i.stock})`)
                    .join(', ');
                throw conflict(`Недостатньо товару на складі: ${details}`);
            }

            const totalAmount = calculateTotal(items);

            const id = await tx.createOrder(userId, dto, totalAmount);
            await tx.addOrderItems(id, items);
            await tx.decreaseStock(items);
            await tx.clearCart(userId);
            return id;
        });

        return this.getOrder(userId, orderId);
    }

    async getUserOrders(userId: number): Promise<Order[]> {
        return this.repo.findByUserId(userId);
    }

    async getOrder(userId: number, orderId: number): Promise<Order> {
        const order = await this.repo.findById(userId, orderId);
        if (!order) throw notFound('Замовлення не знайдено');
        return order;
    }
}
