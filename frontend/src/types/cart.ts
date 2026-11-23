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

export interface CartProps {
    cart: Cart;
    busy: boolean;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemoveItem: (productId: number) => void;
    onClear: () => void;
    onProceedToCheckout: () => void;
}
