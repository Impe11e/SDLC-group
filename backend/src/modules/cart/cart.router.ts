import { Router } from 'express';
import { CartService } from './cart.service.js';

export const cartRouter = Router();
const cartService = new CartService();

// Отримати кошик поточного користувача
cartRouter.get('/', async (req, res) => {
    try {
        const userId = 1; // TODO: брати з req.user після Auth Middleware
        const items = await cartService.getCart(userId);
        res.json(items);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Додати товар до кошика
cartRouter.post('/', async (req, res) => {
    try {
        const userId = 1;
        const { productId, quantity } = req.body;
        await cartService.addToCart(userId, productId, quantity);
        res.status(201).json({ message: 'Товар додано до кошика' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Змінити кількість товару
cartRouter.put('/:productId', async (req, res) => {
    try {
        const userId = 1;
        const productId = Number(req.params.productId);
        const { quantity } = req.body;
        await cartService.updateItemQuantity(userId, productId, quantity);
        res.json({ message: 'Кількість оновлено' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// Видалити товар з кошика
cartRouter.delete('/:productId', async (req, res) => {
    try {
        const userId = 1;
        const productId = Number(req.params.productId);
        await cartService.removeFromCart(userId, productId);
        res.json({ message: 'Товар видалено з кошика' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});
