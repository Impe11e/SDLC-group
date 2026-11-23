import { Router } from 'express';
import { getUserId, userContext } from '../../middleware/user-context.middleware.js';
import { PgProductRepository } from '../product/product.repository.js';
import { parseId } from '../product/product.schema.js';
import { PgCartRepository } from './cart.repository.js';
import { validateAddToCart, validateUpdateCartItem } from './cart.schema.js';
import { CartService } from './cart.service.js';

const cartService = new CartService(new PgCartRepository(), new PgProductRepository());

export const cartRouter = Router();

cartRouter.use(userContext);

cartRouter.get('/', async (_req, res, next) => {
    try {
        res.json(await cartService.getCart(getUserId(res)));
    } catch (err) {
        next(err);
    }
});

cartRouter.post('/', async (req, res, next) => {
    const error = validateAddToCart(req.body);
    if (error) {
        res.status(400).json({ error });
        return;
    }
    try {
        const { productId, quantity } = req.body;
        res.status(201).json(await cartService.addItem(getUserId(res), productId, quantity));
    } catch (err) {
        next(err);
    }
});

cartRouter.put('/:productId', async (req, res, next) => {
    const productId = parseId(req.params.productId);
    if (!productId) {
        res.status(400).json({ error: 'Некоректний ідентифікатор товару' });
        return;
    }
    const error = validateUpdateCartItem(req.body);
    if (error) {
        res.status(400).json({ error });
        return;
    }
    try {
        res.json(await cartService.updateQuantity(getUserId(res), productId, req.body.quantity));
    } catch (err) {
        next(err);
    }
});

cartRouter.delete('/:productId', async (req, res, next) => {
    const productId = parseId(req.params.productId);
    if (!productId) {
        res.status(400).json({ error: 'Некоректний ідентифікатор товару' });
        return;
    }
    try {
        res.json(await cartService.removeItem(getUserId(res), productId));
    } catch (err) {
        next(err);
    }
});

cartRouter.delete('/', async (_req, res, next) => {
    try {
        res.json(await cartService.clear(getUserId(res)));
    } catch (err) {
        next(err);
    }
});
