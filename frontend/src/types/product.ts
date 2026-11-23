export interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
}

export interface ProductListProps {
    products: Product[];
    cartQuantities: Record<number, number>;
    busy: boolean;
    onAddToCart: (productId: number) => void;
}
