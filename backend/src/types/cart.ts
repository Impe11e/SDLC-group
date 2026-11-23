export interface AddToCartDTO {
    productId: number;
    quantity: number;
}

export interface UpdateCartItemDTO {
    quantity: number;
}

export interface CartItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    stock: number;
}

export interface Cart {
    items: CartItem[];
    totalAmount: number;
}

export interface ICartRepository {
    findByUserId(userId: number): Promise<CartItem[]>;
    findItem(userId: number, productId: number): Promise<CartItem | null>;
    setQuantity(userId: number, productId: number, quantity: number): Promise<void>;
    removeItem(userId: number, productId: number): Promise<boolean>;
    clear(userId: number): Promise<void>;
}
