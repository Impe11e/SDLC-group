import React, { useState } from 'react';
import type { CheckoutProps, OrderFormData, OrderFormErrors, PaymentMethod } from '../types/order';
import { formatPrice } from '../utils/format';
import { PAYMENT_METHOD_LABELS, validateOrderForm } from '../utils/orderValidation';

const INITIAL_FORM: OrderFormData = {
    fullName: '',
    deliveryAddress: '',
    paymentMethod: 'CASH_ON_DELIVERY',
};

export const Checkout: React.FC<CheckoutProps> = ({
    totalAmount,
    disabled,
    submitting,
    onSubmitOrder,
}) => {
    const [form, setForm] = useState<OrderFormData>(INITIAL_FORM);
    const [errors, setErrors] = useState<OrderFormErrors>({});
    const [submitted, setSubmitted] = useState(false);

    const updateField = <K extends keyof OrderFormData>(field: K, value: OrderFormData[K]) => {
        const next = { ...form, [field]: value };
        setForm(next);
        if (submitted) setErrors(validateOrderForm(next));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);

        const validationErrors = validateOrderForm(form);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        const success = await onSubmitOrder({
            ...form,
            fullName: form.fullName.trim(),
            deliveryAddress: form.deliveryAddress.trim(),
        });

        if (success) {
            setForm(INITIAL_FORM);
            setErrors({});
            setSubmitted(false);
        }
    };

    return (
        <section className="checkout-container">
            <h2>Оформлення замовлення</h2>
            {disabled ? (
                <p className="muted">Додайте товари до кошика, щоб оформити замовлення</p>
            ) : (
                <form className="checkout-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-field">
                        <label htmlFor="checkout-full-name">ПІБ отримувача</label>
                        <input
                            id="checkout-full-name"
                            type="text"
                            autoComplete="name"
                            placeholder="Іваненко Марія Петрівна"
                            value={form.fullName}
                            aria-invalid={Boolean(errors.fullName)}
                            onChange={(e) => updateField('fullName', e.target.value)}
                        />
                        {errors.fullName && <span className="field-error">{errors.fullName}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="checkout-address">Адреса доставки</label>
                        <input
                            id="checkout-address"
                            type="text"
                            autoComplete="street-address"
                            placeholder="Місто, вулиця, будинок, квартира"
                            value={form.deliveryAddress}
                            aria-invalid={Boolean(errors.deliveryAddress)}
                            onChange={(e) => updateField('deliveryAddress', e.target.value)}
                        />
                        {errors.deliveryAddress && (
                            <span className="field-error">{errors.deliveryAddress}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="checkout-payment">Спосіб оплати</label>
                        <select
                            id="checkout-payment"
                            value={form.paymentMethod}
                            onChange={(e) =>
                                updateField('paymentMethod', e.target.value as PaymentMethod)
                            }
                        >
                            {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        {errors.paymentMethod && (
                            <span className="field-error">{errors.paymentMethod}</span>
                        )}
                    </div>

                    <p className="checkout-total">До сплати: {formatPrice(totalAmount)}</p>

                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Оформлюємо…' : 'Підтвердити замовлення'}
                    </button>
                </form>
            )}
        </section>
    );
};
