import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiError, getErrorMessage } from '../services/api';
import { cartService } from '../services/cartService';
import { productService } from '../services/productService';
import type { Product } from '../types/product';
import { formatPrice } from '../utils/format';

export default function ProductPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        productService
            .getById(Number(id))
            .then(setProduct)
            .catch((err) =>
                setError(
                    err instanceof ApiError && err.status === 404
                        ? 'Товар не знайдено'
                        : getErrorMessage(err)
                )
            )
            .finally(() => setLoading(false));
    }, [id]);

    const handleAdd = async () => {
        if (!product) return;
        setAdding(true);
        setError(null);
        setMessage(null);
        try {
            await cartService.add(product.id);
            setMessage('Товар додано в кошик');
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="app">
            <Link to="/">← До каталогу</Link>

            {loading && <p className="muted">Завантаження…</p>}
            {error && (
                <p className="alert" role="alert">
                    {error}
                </p>
            )}
            {message && (
                <p className="alert success" role="status">
                    {message}
                </p>
            )}

            {product && (
                <article>
                    <span className="product-category">{product.category}</span>
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <p className="product-price">{formatPrice(product.price)}</p>
                    <p className="muted">
                        {product.stock === 0
                            ? 'Немає в наявності'
                            : `В наявності: ${product.stock}`}
                    </p>
                    <button
                        type="button"
                        disabled={adding || product.stock === 0}
                        onClick={handleAdd}
                    >
                        {product.stock === 0 ? 'Немає в наявності' : 'Додати в кошик'}
                    </button>
                </article>
            )}
        </div>
    );
}