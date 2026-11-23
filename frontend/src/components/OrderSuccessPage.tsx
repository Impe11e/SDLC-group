import { Link, useLocation } from 'react-router-dom';
import { formatPrice } from '../utils/format';

interface SuccessState {
    orderId: number;
    totalAmount: number;
}

export default function OrderSuccessPage() {
    const state = useLocation().state as SuccessState | null;

    if (!state) {
        return (
            <div className="app">
                <p className="muted">Немає даних про замовлення.</p>
                <Link to="/">До каталогу</Link>
            </div>
        );
    }

    return (
        <div className="app">
            <h1>Дякуємо за замовлення!</h1>
            <p>
                Замовлення №{state.orderId} на суму {formatPrice(state.totalAmount)} прийнято.
            </p>
            <Link to="/">Повернутися до каталогу</Link>
        </div>
    );
}