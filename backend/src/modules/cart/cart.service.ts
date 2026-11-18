import { conflict, notFound } from '../../errors/http-error.js';
import type { Cart, CartItem, ICartRepository } from '../../types/cart.js';
import type { IProductRepository } from '../../types/product.js';

export function calculateTotal(items: Pick<CartItem, 'price' | 'quantity'>[]): number {
    const cents = items.reduce(
        (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
        0
    );
    return cents / 100;
}

export class CartService {
    private readonly cartRepo: ICartRepository;
    private readonly productRepo: IProductRepository;

    constructor(cartRepo: ICartRepository, productRepo: IProductRepository) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
    }

    async getCart(userId: number): Promise<Cart> {
        const items = await this.cartRepo.findByUserId(userId);
        return { items, totalAmount: calculateTotal(items) };
    }

    async addItem(userId: number, productId: number, quantity: number): Promise<Cart> {
        const product = await this.productRepo.findById(productId);
        if (!product) throw notFound('Товар не знайдено');

        const existing = await this.cartRepo.findItem(userId, productId);
        const newQuantity = (existing?.quantity ?? 0) + quantity;

        if (newQuantity > product.stock) {
            throw conflict(
                `Недостатньо товару "${product.name}" на складі (доступно: ${product.stock})`
            );
        }

        await this.cartRepo.setQuantity(userId, productId, newQuantity);
        return this.getCart(userId);
    }

    async updateQuantity(userId: number, productId: number, quantity: number): Promise<Cart> {
        const existing = await this.cartRepo.findItem(userId, productId);
        if (!existing) throw notFound('Товару немає в кошику');

        if (quantity === 0) {
            await this.cartRepo.removeItem(userId, productId);
            return this.getCart(userId);
        }

        if (quantity > existing.stock) {
            throw conflict(
                `Недостатньо товару "${existing.productName}" на складі (доступно: ${existing.stock})`
            );
        }

        await this.cartRepo.setQuantity(userId, productId, quantity);
        return this.getCart(userId);
    }

    async removeItem(userId: number, productId: number): Promise<Cart> {
        const removed = await this.cartRepo.removeItem(userId, productId);
        if (!removed) throw notFound('Товару немає в кошику');
        return this.getCart(userId);
    }

    async clear(userId: number): Promise<Cart> {
        await this.cartRepo.clear(userId);
        return this.getCart(userId);
    }
}
