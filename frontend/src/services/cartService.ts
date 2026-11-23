import type { Cart } from '../types/cart';
import { request } from './api';

export const cartService = {
    get: () => request<Cart>('GET', '/cart'),

    add: (productId: number, quantity = 1) =>
        request<Cart>('POST', '/cart', { productId, quantity }),

    updateQuantity: (productId: number, quantity: number) =>
        request<Cart>('PUT', `/cart/${productId}`, { quantity }),

    remove: (productId: number) => request<Cart>('DELETE', `/cart/${productId}`),

    clear: () => request<Cart>('DELETE', '/cart'),
};
