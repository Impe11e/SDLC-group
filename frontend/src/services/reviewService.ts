import type { Review } from '../types/review';
import { request } from './api';

export const reviewService = {
    getForProduct: (productId: number) =>
        request<Review[]>('GET', `/products/${productId}/reviews`),

    add: (productId: number, rating: number, text: string) =>
        request<Review>('POST', `/products/${productId}/reviews`, { rating, text }),
};
