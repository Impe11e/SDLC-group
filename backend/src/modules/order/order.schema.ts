import type { CreateOrderDTO, PaymentMethod } from '../../types/order.js';

export const PAYMENT_METHODS: readonly PaymentMethod[] = ['CASH_ON_DELIVERY', 'CARD_ON_DELIVERY'];

const asTrimmedString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

export function validateCreateOrder(
    data: Partial<Record<keyof CreateOrderDTO, unknown>> | undefined
): string | null {
    const fullName = asTrimmedString(data?.fullName);
    const deliveryAddress = asTrimmedString(data?.deliveryAddress);

    if (!fullName) return 'Вкажіть ПІБ отримувача';
    if (fullName.split(/\s+/).length < 2) return 'ПІБ має містити щонайменше прізвище та імʼя';
    if (fullName.length > 255) return 'ПІБ занадто довге (максимум 255 символів)';

    if (!deliveryAddress) return 'Вкажіть адресу доставки';
    if (deliveryAddress.length < 5) return 'Адреса доставки занадто коротка';
    if (deliveryAddress.length > 500)
        return 'Адреса доставки занадто довга (максимум 500 символів)';

    if (!PAYMENT_METHODS.includes(data?.paymentMethod as PaymentMethod)) {
        return 'Оберіть коректний спосіб оплати';
    }
    return null;
}

export function toCreateOrderDTO(data: Record<keyof CreateOrderDTO, unknown>): CreateOrderDTO {
    return {
        fullName: asTrimmedString(data.fullName).replace(/\s+/g, ' '),
        deliveryAddress: asTrimmedString(data.deliveryAddress),
        paymentMethod: data.paymentMethod as PaymentMethod,
    };
}
