import { Router } from 'express';
import { PgProductRepository } from './product.repository.js';
import { parseId } from './product.schema.js';
import { ProductService } from './product.service.js';

const productService = new ProductService(new PgProductRepository());

export const productRouter = Router();

productRouter.get('/', async (_req, res, next) => {
    try {
        res.json(await productService.getAll());
    } catch (err) {
        next(err);
    }
});

productRouter.get('/:id', async (req, res, next) => {
    const id = parseId(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'Некоректний ідентифікатор товару' });
        return;
    }
    try {
        res.json(await productService.getById(id));
    } catch (err) {
        if ((err as Error).message === 'Товар не знайдено') {
            res.status(404).json({ error: (err as Error).message });
            return;
        }
        next(err);
    }
});
