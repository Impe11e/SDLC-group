import type { Order, OrderFormData } from '../types/order';
import { request } from './api';

export const orderService = {
    create: (data: OrderFormData) => request<Order>('POST', '/orders', data),

    getAll: () => request<Order[]>('GET', '/orders'),
};
