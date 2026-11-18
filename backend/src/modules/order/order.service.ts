import { OrderRepository } from './order.repository.js';
import { PgCartRepository } from '../cart/cart.repository.js';
import type { CreateOrderDTO } from '../../types/order.js';

export class OrderService {
    private orderRepository = new OrderRepository();
    private cartRepository = new PgCartRepository();

    async placeOrder(userId: number, dto: CreateOrderDTO) {
        const cartItems = await this.cartRepository.findByUserId(userId);

        if (!cartItems || cartItems.length === 0) {
            throw new Error('Кошик порожній, неможливо оформити замовлення');
        }

        const totalAmount = 1500;

        const orderId = await this.orderRepository.createOrderTransaction(
            userId,
            {
                ...dto,
                totalAmount,
            },
            cartItems
        );

        return orderId;
    }
}
