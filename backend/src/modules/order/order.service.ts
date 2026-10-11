import { OrderRepository } from './order.repository.js';
import { CartRepository } from '../cart/cart.repository.js';
import { CreateOrderDTO } from './order.schema.js';

export class OrderService {
  private orderRepository = new OrderRepository();
  private cartRepository = new CartRepository();

  async placeOrder(userId: number, dto: CreateOrderDTO) {
    const cartItems = await this.cartRepository.getCartItemsByUserId(userId);
    
    if (!cartItems || cartItems.length === 0) {
      throw new Error('Кошик порожній, неможливо оформити замовлення');
    }

    const totalAmount = 1500; 

    const orderId = await this.orderRepository.createOrderTransaction(userId, {
      ...dto,
      totalAmount,
    }, cartItems);

    return orderId;
  }
}