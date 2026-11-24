import type { Product, ProductInput } from '../types/product';
import { request } from './api';

export const productService = {
    getAll: () => request<Product[]>('GET', '/products'),

    getById: (id: number) => request<Product>('GET', `/products/${id}`),

    create: (data: ProductInput) => request<Product>('POST', '/products', data),

    update: (id: number, data: ProductInput) => request<Product>('PUT', `/products/${id}`, data),

    remove: (id: number) => request<{ message: string }>('DELETE', `/products/${id}`),
};
