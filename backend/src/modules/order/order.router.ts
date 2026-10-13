import { Router } from 'express';
import { OrderService } from './order.service.js';

const router = Router();
const orderService = new OrderService();

router.post('/', async (req, res) => {
    try {
        const userId = 1; // TODO: брати з JWT через Auth Middleware
        const { fullName, deliveryAddress, paymentMethod } = req.body;

        if (!fullName || !deliveryAddress || !paymentMethod) {
            return res.status(400).json({ error: 'Всі поля обовʼязкові для заповнення' });
        }

        const orderId = await orderService.placeOrder(userId, {
            fullName,
            deliveryAddress,
            paymentMethod,
        });

        res.status(201).json({ message: 'Замовлення успішно створено', orderId });
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Помилка при створенні замовлення' });
    }
});

export default router;
