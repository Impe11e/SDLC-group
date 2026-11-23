import React from 'react';
import type { CartProps } from '../types/cart';
import { formatPrice } from '../utils/format';

export const Cart: React.FC<CartProps> = ({
    cart,
    busy,
    onUpdateQuantity,
    onRemoveItem,
    onClear,
    onProceedToCheckout,
}) => {
    return (
        <section className="cart-container">
            <h2>Кошик товарів</h2>
            {cart.items.length === 0 ? (
                <p className="muted">Ваш кошик порожній</p>
            ) : (
                <>
                    <ul className="cart-items-list">
                        {cart.items.map((item) => (
                            <li key={item.productId} className="cart-item">
                                <div className="cart-item-info">
                                    <span className="cart-item-name">{item.productName}</span>
                                    <span className="muted">{formatPrice(item.price)} / шт.</span>
                                </div>
                                <div className="quantity-control">
                                    <button
                                        type="button"
                                        aria-label="Зменшити кількість"
                                        disabled={busy}
                                        onClick={() =>
                                            onUpdateQuantity(item.productId, item.quantity - 1)
                                        }
                                    >
                                        −
                                    </button>
                                    <span aria-live="polite">{item.quantity}</span>
                                    <button
                                        type="button"
                                        aria-label="Збільшити кількість"
                                        disabled={busy || item.quantity >= item.stock}
                                        onClick={() =>
                                            onUpdateQuantity(item.productId, item.quantity + 1)
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="cart-item-sum">
                                    {formatPrice(item.price * item.quantity)}
                                </span>
                                <button
                                    type="button"
                                    className="link-button"
                                    disabled={busy}
                                    onClick={() => onRemoveItem(item.productId)}
                                >
                                    Видалити
                                </button>
                                {item.quantity >= item.stock && (
                                    <span className="hint">Максимальна доступна кількість</span>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="cart-summary">
                        <h3>Загальна сума: {formatPrice(cart.totalAmount)}</h3>
                        <div className="cart-actions">
                            <button
                                type="button"
                                className="secondary"
                                disabled={busy}
                                onClick={onClear}
                            >
                                Очистити кошик
                            </button>
                            <button type="button" disabled={busy} onClick={onProceedToCheckout}>
                                Оформити замовлення
                            </button>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};
