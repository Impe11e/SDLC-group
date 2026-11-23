import { Router } from 'express';
import { getUserId, userContext } from '../../middleware/user-context.middleware.js';
import { parseId } from '../product/product.schema.js';
import { OrderService } from './order.service.js';
import { PgOrderRepository } from './order.repository.js';

const orderService = new OrderService(new PgOrderRepository());

export const orderRouter = Router();

orderRouter.use(userContext);

orderRouter.post('/', async (req, res, next) => {
    try {
        const order = await orderService.placeOrder(getUserId(res), req.body ?? {});
        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
});

orderRouter.get('/', async (_req, res, next) => {
    try {
        res.json(await orderService.getUserOrders(getUserId(res)));
    } catch (err) {
        next(err);
    }
});

orderRouter.get('/:id', async (req, res, next) => {
    const orderId = parseId(req.params.id);
    if (!orderId) {
        res.status(400).json({ error: 'Некоректний ідентифікатор замовлення' });
        return;
    }
    try {
        res.json(await orderService.getOrder(getUserId(res), orderId));
    } catch (err) {
        next(err);
    }
});
