import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ProductListProps } from '../types/product';
import { formatPrice } from '../utils/format';
import { ProductImage } from './ProductImage';

export const ProductList: React.FC<ProductListProps> = ({
    products,
    cartQuantities,
    busy,
    onAddToCart,
}) => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const categories = useMemo(
        () => Array.from(new Set(products.map((p) => p.category))),
        [products]
    );

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        return products.filter(
            (p) =>
                (!category || p.category === category) &&
                (!query || p.name.toLowerCase().includes(query))
        );
    }, [products, search, category]);

    const resetFilters = () => {
        setSearch('');
        setCategory('');
    };

    return (
        <section className="products">
            <h2>Каталог</h2>

            <div className="catalog-filters">
                <input
                    placeholder="Пошук за назвою"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Усі категорії</option>
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
                <button type="button" onClick={resetFilters}>
                    Скинути
                </button>
            </div>

            {products.length === 0 && <p className="muted">Товарів поки немає</p>}
            {products.length > 0 && filtered.length === 0 && (
                <p className="muted">За вашим запитом нічого не знайдено</p>
            )}

            <ul className="product-grid">
                {filtered.map((product) => {
                    const inCart = cartQuantities[product.id] ?? 0;
                    const outOfStock = product.stock === 0;
                    const limitReached = inCart >= product.stock;

                    return (
                        <li key={product.id} className="product-card">
                            <Link to={`/products/${product.id}`} className="product-image-link">
                                <ProductImage product={product} className="product-image" />
                            </Link>
                            <span className="product-category">{product.category}</span>
                            <h3>
                                <Link to={`/products/${product.id}`}>{product.name}</Link>
                            </h3>
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
