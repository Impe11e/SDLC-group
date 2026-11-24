import { notFound } from '../../errors/http-error.js';
import type { IProductRepository, ProductInput } from '../../types/product.js';

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

    async create(input: ProductInput) {
        return this.repo.create(input);
    }

    async update(id: number, input: ProductInput) {
        const product = await this.repo.update(id, input);
        if (!product) throw notFound('Товар не знайдено');
        return product;
    }

    async remove(id: number) {
        const removed = await this.repo.remove(id);
        if (!removed) throw notFound('Товар не знайдено');
    }
}
