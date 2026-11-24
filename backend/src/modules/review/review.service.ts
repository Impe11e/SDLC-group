import { conflict, notFound } from '../../errors/http-error.js';
import type { IProductRepository } from '../../types/product.js';
import type { IReviewRepository, ReviewInput } from '../../types/review.js';

export class ReviewService {
    private readonly reviews: IReviewRepository;
    private readonly products: IProductRepository;

    constructor(reviews: IReviewRepository, products: IProductRepository) {
        this.reviews = reviews;
        this.products = products;
    }

    private async ensureProduct(productId: number) {
        if (!(await this.products.findById(productId))) {
            throw notFound('Товар не знайдено');
        }
    }

    async getForProduct(productId: number) {
        await this.ensureProduct(productId);
        return this.reviews.findByProduct(productId);
    }

    async add(productId: number, userId: number, input: ReviewInput) {
        await this.ensureProduct(productId);
        if (await this.reviews.exists(productId, userId)) {
            throw conflict('Ви вже залишили відгук на цей товар');
        }
        return this.reviews.create(productId, userId, input);
    }
}
