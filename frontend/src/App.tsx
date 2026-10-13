import { useState } from 'react';
import { Cart } from './components/Cart';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import { CheckoutForm } from './components/OrderForm';
import ProfilePage from './components/ProfilePage';
import type { CartItem } from './types/cart';
import type { OrderFormData } from './types/order';

export default function App() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const handleUpdateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            handleRemoveItem(productId);
            return;
        }

        setCartItems((items) =>
            items.map((item) => (item.productId === productId ? { ...item, quantity } : item))
        );
    };

    const handleRemoveItem = (productId: number) => {
        setCartItems((items) => items.filter((item) => item.productId !== productId));
    };

    const handleProceedToCheckout = () => {
        document.querySelector('.checkout-container')?.scrollIntoView({
            behavior: 'smooth',
        });
    };

    const handleSubmitOrder = (formData: OrderFormData) => {
        console.log('submit order', formData, cartItems);
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

                <Cart
                    items={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onProceedToCheckout={handleProceedToCheckout}
                />

                <CheckoutForm onSubmitOrder={handleSubmitOrder} />
            </main>
        </div>
    );
}
