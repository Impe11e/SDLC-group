import { notFound } from '../../errors/http-error.js';
import type { IProductRepository } from '../../types/product.js';

export class ProductService {
    private readonly repo: IProductRepository;

    constructor(repo: IProductRepository) {
        this.repo = repo;
    }

    async getAll() {
        return this.repo.findAll();
    }

    async getById(id: number) {
        const product = await this.repo.findById(id);
        if (!product) throw notFound('Товар не знайдено');
        return product;
    }
}
