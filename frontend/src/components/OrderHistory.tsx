import React from 'react';
import type { OrderHistoryProps } from '../types/order';
import { formatPrice } from '../utils/format';
import { PAYMENT_METHOD_LABELS } from '../utils/orderValidation';

const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

export const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
    return (
        <section className="order-history">
            <h2>Мої замовлення</h2>
            {orders.length === 0 ? (
                <p className="muted">Ви ще не оформили жодного замовлення</p>
            ) : (
                <ul className="order-list">
                    {orders.map((order) => (
                        <li key={order.id} className="order-card">
                            <div className="order-header">
                                <strong>Замовлення №{order.id}</strong>
                                <span className="muted">
                                    {dateFormatter.format(new Date(order.createdAt))}
                                </span>
                            </div>
                            <ul className="order-items">
                                {order.items.map((item) => (
                                    <li key={item.productId}>
                                        {item.productName} × {item.quantity} —{' '}
                                        {formatPrice(item.price * item.quantity)}
                                    </li>
                                ))}
                            </ul>
                            <p className="muted">
                                {order.fullName}, {order.deliveryAddress} ·{' '}
                                {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                            </p>
                            <p className="order-total">Сума: {formatPrice(order.totalAmount)}</p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};
