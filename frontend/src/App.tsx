import { useEffect, useMemo, useState } from 'react';
import { Cart } from './components/Cart';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import { Checkout } from './components/Checkout';
import { OrderHistory } from './components/OrderHistory';
import ProfilePage from './components/ProfilePage';
import { ProductList } from './components/ProductList';
import { ApiError, getErrorMessage } from './services/api';
import { cartService } from './services/cartService';
import { orderService } from './services/orderService';
import { productService } from './services/productService';
import type { Cart as CartData } from './types/cart';
import type { Order, OrderFormData } from './types/order';
import type { Product } from './types/product';
import { formatPrice } from './utils/format';

const EMPTY_CART: CartData = { items: [], totalAmount: 0 };

async function fetchShopData() {
    const [products, cart, orders] = await Promise.all([
        productService.getAll(),
        cartService.get(),
        orderService.getAll(),
    ]);
    return { products, cart, orders };
}

export default function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartData>(EMPTY_CART);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const applyShopData = (data: Awaited<ReturnType<typeof fetchShopData>>) => {
        setProducts(data.products);
        setCart(data.cart);
        setOrders(data.orders);
    };

    useEffect(() => {
        fetchShopData()
            .then(applyShopData)
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
        setSuccessMessage(null);
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

    const handleSubmitOrder = async (formData: OrderFormData): Promise<boolean> => {
        setSubmitting(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const order = await orderService.create(formData);
            setSuccessMessage(
                `Замовлення №${order.id} на суму ${formatPrice(order.totalAmount)} успішно оформлено!`
            );
            applyShopData(await fetchShopData());
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return true;
        } catch (err) {
            setError(getErrorMessage(err));
            if (err instanceof ApiError && err.status === 409) {
                fetchShopData()
                    .then(applyShopData)
                    .catch(() => undefined);
            }
            return false;
        } finally {
            setSubmitting(false);
        }
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

                {successMessage && (
                    <div className="alert success" role="status">
                        {successMessage}
                        <button
                            type="button"
                            className="link-button"
                            onClick={() => setSuccessMessage(null)}
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

                {!loading && (
                    <>
                        <Checkout
                            totalAmount={cart.totalAmount}
                            disabled={cart.items.length === 0}
                            submitting={submitting}
                            onSubmitOrder={handleSubmitOrder}
                        />
                        <OrderHistory orders={orders} />
                    </>
                )}
            </main>
        </div>
    );
}
