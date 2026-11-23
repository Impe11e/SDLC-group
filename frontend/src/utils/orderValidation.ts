import type { OrderFormData, OrderFormErrors, PaymentMethod } from '../types/order';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
    CASH_ON_DELIVERY: 'Готівкою при отриманні',
    CARD_ON_DELIVERY: 'Карткою при отриманні',
};

export function validateOrderForm(data: OrderFormData): OrderFormErrors {
    const errors: OrderFormErrors = {};
    const fullName = data.fullName.trim();
    const deliveryAddress = data.deliveryAddress.trim();

    if (!fullName) {
        errors.fullName = 'Вкажіть ПІБ отримувача';
    } else if (fullName.split(/\s+/).length < 2) {
        errors.fullName = 'Вкажіть щонайменше прізвище та імʼя';
    } else if (fullName.length > 255) {
        errors.fullName = 'ПІБ занадто довге (максимум 255 символів)';
    }

    if (!deliveryAddress) {
        errors.deliveryAddress = 'Вкажіть адресу доставки';
    } else if (deliveryAddress.length < 5) {
        errors.deliveryAddress = 'Адреса доставки занадто коротка';
    } else if (deliveryAddress.length > 500) {
        errors.deliveryAddress = 'Адреса доставки занадто довга (максимум 500 символів)';
    }

    if (!(data.paymentMethod in PAYMENT_METHOD_LABELS)) {
        errors.paymentMethod = 'Оберіть спосіб оплати';
    }

    return errors;
}
