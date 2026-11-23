import React from 'react';
import type { ProductListProps } from '../types/product';
import { formatPrice } from '../utils/format';

export const ProductList: React.FC<ProductListProps> = ({
    products,
    cartQuantities,
    busy,
    onAddToCart,
}) => {
    if (products.length === 0) {
        return (
            <section className="products">
                <h2>Каталог</h2>
                <p className="muted">Товарів поки немає</p>
            </section>
        );
    }

    return (
        <section className="products">
            <h2>Каталог</h2>
            <ul className="product-grid">
                {products.map((product) => {
                    const inCart = cartQuantities[product.id] ?? 0;
                    const outOfStock = product.stock === 0;
                    const limitReached = inCart >= product.stock;

                    return (
                        <li key={product.id} className="product-card">
                            <span className="product-category">{product.category}</span>
                            <h3>{product.name}</h3>
                            <p className="muted">{product.description}</p>
                            <p className="product-price">{formatPrice(product.price)}</p>
                            <p className="muted">
                                {outOfStock ? 'Немає в наявності' : `В наявності: ${product.stock}`}
                            </p>
                            <button
                                type="button"
                                disabled={busy || outOfStock || limitReached}
                                onClick={() => onAddToCart(product.id)}
                            >
                                {inCart > 0 ? `В кошику: ${inCart} · Додати ще` : 'В кошик'}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};
