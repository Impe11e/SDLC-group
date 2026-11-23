export type PaymentMethod = 'CASH_ON_DELIVERY' | 'CARD_ON_DELIVERY';

export interface OrderFormData {
    fullName: string;
    deliveryAddress: string;
    paymentMethod: PaymentMethod;
}

export type OrderFormErrors = Partial<Record<keyof OrderFormData, string>>;

export interface OrderItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: number;
    userId: number;
    fullName: string;
    deliveryAddress: string;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
}

export interface CheckoutProps {
    totalAmount: number;
    disabled: boolean;
    submitting: boolean;
    onSubmitOrder: (formData: OrderFormData) => Promise<boolean>;
}

export interface OrderHistoryProps {
    orders: Order[];
}
