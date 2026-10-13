export interface OrderFormData {
    fullName: string;
    deliveryAddress: string;
    paymentMethod: string;
}

export interface CheckoutFormProps {
    onSubmitOrder: (formData: OrderFormData) => void;
}
