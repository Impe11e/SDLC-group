import React from 'react';

export interface CartItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
}

interface CartProps {
    items: CartItem[];
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemoveItem: (productId: number) => void;
    onProceedToCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({
    items,
    onUpdateQuantity,
    onRemoveItem,
    onProceedToCheckout,
}) => {
    const calculateTotal = (): number => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    return (
        <div className="cart-container">
            <h2>Кошик товарів</h2>
            {items.length === 0 ? (
                <p>Ваш кошик порожній</p>
            ) : (
                <>
                    <ul className="cart-items-list">
                        {items.map((item) => (
                            <li key={item.productId} className="cart-item">
                                <span>{item.productName}</span>
                                <span>{item.price} грн</span>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => onUpdateQuantity(item.productId, Number(e.target.value))}
                                />
                                <button onClick={() => onRemoveItem(item.productId)}>Видалити</button>
                            </li>
                        ))}
                    </ul>
                    <div className="cart-summary">
                        <h3>Загальна сума: {calculateTotal()} грн</h3>
                        <button onClick={onProceedToCheckout}>Оформити замовлення</button>
                    </div>
                </>
            )}
        </div>
    );
};