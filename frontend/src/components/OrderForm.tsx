import React, { useState } from 'react';
import type { CheckoutFormProps } from '../types/order';

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmitOrder }) => {
    const [fullName, setFullName] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmitOrder({ fullName, deliveryAddress, paymentMethod });
    };

    return (
        <div className="checkout-container">
            <h2>Оформлення замовлення</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ПІБ отримувача:</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Адреса доставки:</label>
                    <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Спосіб оплати:</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="CASH_ON_DELIVERY">Готівкою при отриманні</option>
                    </select>
                </div>
                <button type="submit">Підтвердити замовлення</button>
            </form>
        </div>
    );
};
