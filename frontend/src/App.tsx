import { useEffect, useMemo, useState } from 'react';
import { Cart } from './components/Cart';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import { CheckoutForm } from './components/OrderForm';
import ProfilePage from './components/ProfilePage';
import { ProductList } from './components/ProductList';
import { getErrorMessage } from './services/api';
import { cartService } from './services/cartService';
import { productService } from './services/productService';
import type { Cart as CartData } from './types/cart';
import type { OrderFormData } from './types/order';
import type { Product } from './types/product';

const EMPTY_CART: CartData = { items: [], totalAmount: 0 };

export default function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartData>(EMPTY_CART);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([productService.getAll(), cartService.get()])
            .then(([productList, cartData]) => {
                setProducts(productList);
                setCart(cartData);
            })
            .catch((err) => setError(getErrorMessage(err)))
            .finally(() => setLoading(false));
    }, []);

    const cartQuantities = useMemo(
        () => Object.fromEntries(cart.items.map((item) => [item.productId, item.quantity])),
        [cart]
    );

    const runCartAction = async (action: () => Promise<CartData>) => {
        setBusy(true);
        setError(null);
        try {
            setCart(await action());
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setBusy(false);
        }
    };

    const handleAddToCart = (productId: number) => runCartAction(() => cartService.add(productId));

    const handleUpdateQuantity = (productId: number, quantity: number) =>
        runCartAction(() => cartService.updateQuantity(productId, Math.max(quantity, 0)));

    const handleRemoveItem = (productId: number) =>
        runCartAction(() => cartService.remove(productId));

    const handleClearCart = () => runCartAction(() => cartService.clear());

    const handleProceedToCheckout = () => {
        document.querySelector('.checkout-container')?.scrollIntoView({
            behavior: 'smooth',
        });
    };

    const handleSubmitOrder = (formData: OrderFormData) => {
        console.log('submit order', formData, cart);
    };

    return (
        <div className="app">
            <header>
                <h1>Інтернет-магазин спортивного харчування</h1>
            </header>

            <main>
                <section aria-label="Автентифікація">
                    <LoginForm />
                    <RegisterForm />
                </section>

                <ProfilePage />

                {error && (
                    <div className="alert" role="alert">
                        {error}
                        <button
                            type="button"
                            className="link-button"
                            onClick={() => setError(null)}
                        >
                            Закрити
                        </button>
                    </div>
                )}

                {loading ? (
                    <p className="muted">Завантаження…</p>
                ) : (
                    <div className="shop-layout">
                        <ProductList
                            products={products}
                            cartQuantities={cartQuantities}
                            busy={busy}
                            onAddToCart={handleAddToCart}
                        />
                        <Cart
                            cart={cart}
                            busy={busy}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveItem}
                            onClear={handleClearCart}
                            onProceedToCheckout={handleProceedToCheckout}
                        />
                    </div>
                )}

                <CheckoutForm onSubmitOrder={handleSubmitOrder} />
            </main>
        </div>
    );
}
