import type { Product } from '../types/product';
import { request } from './api';

export const productService = {
    getAll: () => request<Product[]>('GET', '/products'),
};
