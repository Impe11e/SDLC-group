export interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
}

export interface IProductRepository {
    findAll(): Promise<Product[]>;
    findById(id: number): Promise<Product | null>;
}
