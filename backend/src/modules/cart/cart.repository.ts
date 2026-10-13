export class CartRepository {
  async getCartItemsByUserId(userId: number) {
    // TODO: SELECT cart_items JOIN products WHERE user_id = userId
    return [];
  }

  async addOrUpdateItem(userId: number, productId: number, quantity: number) {
    // TODO: UPSERT в таблицю cart_items
  }

  async updateQuantity(userId: number, productId: number, quantity: number) {
    // TODO: UPDATE cart_items SET quantity = ... WHERE user_id = ... AND product_id = ...
  }

  async removeItem(userId: number, productId: number) {
    // TODO: DELETE FROM cart_items WHERE user_id = ... AND product_id = ...
  }

  async clearCart(userId: number) {
    // TODO: DELETE FROM cart_items WHERE user_id = ...
  }
}