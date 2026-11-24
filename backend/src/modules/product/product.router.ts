import { Router } from 'express';
import { badRequest } from '../../errors/http-error.js';
import { authRequired, requireRole } from '../../middleware/auth.middleware.js';
import { PgProductRepository } from './product.repository.js';
import { parseId, toProductInput, validateProductInput } from './product.schema.js';
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
        next(err);
    }
});

productRouter.post('/', authRequired, requireRole('ADMIN'), async (req, res, next) => {
    const error = validateProductInput(req.body);
    if (error) {
        next(badRequest(error));
        return;
    }
    try {
        res.status(201).json(await productService.create(toProductInput(req.body)));
    } catch (err) {
        next(err);
    }
});

productRouter.put('/:id', authRequired, requireRole('ADMIN'), async (req, res, next) => {
    const id = parseId(req.params.id);
    if (!id) {
        next(badRequest('Некоректний ідентифікатор товару'));
        return;
    }
    const error = validateProductInput(req.body);
    if (error) {
        next(badRequest(error));
        return;
    }
    try {
        res.json(await productService.update(id, toProductInput(req.body)));
    } catch (err) {
        next(err);
    }
});

productRouter.delete('/:id', authRequired, requireRole('ADMIN'), async (req, res, next) => {
    const id = parseId(req.params.id);
    if (!id) {
        next(badRequest('Некоректний ідентифікатор товару'));
        return;
    }
    try {
        await productService.remove(id);
        res.json({ message: 'Товар видалено' });
    } catch (err) {
        next(err);
    }
});
