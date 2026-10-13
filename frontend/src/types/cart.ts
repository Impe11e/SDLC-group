export interface CartItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
}

export interface CartProps {
    items: CartItem[];
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemoveItem: (productId: number) => void;
    onProceedToCheckout: () => void;
}
