import { CartRepository } from './cart.repository.js';

export class CartService {
  private cartRepository = new CartRepository();

  async getCart(userId: number) {
    return await this.cartRepository.getCartItemsByUserId(userId);
  }

  async addToCart(userId: number, productId: number, quantity: number) {
    if (quantity <= 0) {
      throw new Error('Кількість має бути більшою за нуль');
    }
    await this.cartRepository.addOrUpdateItem(userId, productId, quantity);
  }

  async updateItemQuantity(userId: number, productId: number, quantity: number) {
    if (quantity <= 0) {
      await this.cartRepository.removeItem(userId, productId);
    } else {
      await this.cartRepository.updateQuantity(userId, productId, quantity);
    }
  }

  async removeFromCart(userId: number, productId: number) {
    await this.cartRepository.removeItem(userId, productId);
  }
}