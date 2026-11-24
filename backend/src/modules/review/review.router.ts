import { Router } from 'express';
import { badRequest } from '../../errors/http-error.js';
import { authRequired, getUserId } from '../../middleware/auth.middleware.js';
import { PgProductRepository } from '../product/product.repository.js';
import { parseId } from '../product/product.schema.js';
import { PgReviewRepository } from './review.repository.js';
import { toReviewInput, validateReview } from './review.schema.js';
import { ReviewService } from './review.service.js';

const reviewService = new ReviewService(new PgReviewRepository(), new PgProductRepository());

export const reviewRouter = Router({ mergeParams: true });

const getProductId = (params: unknown) => parseId((params as { productId?: string }).productId);

reviewRouter.get('/', async (req, res, next) => {
    const productId = getProductId(req.params);
    if (!productId) {
        next(badRequest('Некоректний ідентифікатор товару'));
        return;
    }
    try {
        res.json(await reviewService.getForProduct(productId));
    } catch (err) {
        next(err);
    }
});

reviewRouter.post('/', authRequired, async (req, res, next) => {
    const productId = getProductId(req.params);
    if (!productId) {
        next(badRequest('Некоректний ідентифікатор товару'));
        return;
    }
    const error = validateReview(req.body);
    if (error) {
        next(badRequest(error));
        return;
    }
    try {
        const review = await reviewService.add(productId, getUserId(res), toReviewInput(req.body));
        res.status(201).json(review);
    } catch (err) {
        next(err);
    }
});
