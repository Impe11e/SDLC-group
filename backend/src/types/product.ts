export interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    manufacturer: string;
    composition: string;
    imageUrl: string;
}

export type ProductInput = Omit<Product, 'id'>;

export interface IProductRepository {
    findAll(): Promise<Product[]>;
    findById(id: number): Promise<Product | null>;
    create(input: ProductInput): Promise<Product>;
    update(id: number, input: ProductInput): Promise<Product | null>;
    remove(id: number): Promise<boolean>;
}
