import { type SubmitEvent, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getErrorMessage } from '../services/api';
import { authService } from '../services/authService';

export default function ResetPasswordPage() {
    const [params] = useSearchParams();
    const token = params.get('token');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        if (password !== confirm) {
            setError('Паролі не збігаються');
            return;
        }
        setSubmitting(true);
        try {
            await authService.resetPassword(token ?? '', password);
            setDone(true);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    if (!token) {
        return (
            <div className="app">
                <p className="alert" role="alert">
                    Посилання недійсне: відсутній токен.
                </p>
                <Link to="/forgot-password">Запросити нове посилання</Link>
            </div>
        );
    }

    if (done) {
        return (
            <div className="app">
                <p className="alert success" role="status">
                    Пароль змінено. Тепер можна увійти з новим паролем.
                </p>
                <Link to="/login">Перейти до входу</Link>
            </div>
        );
    }

    return (
        <div className="app">
            <form onSubmit={handleSubmit}>
                <h2>Новий пароль</h2>
                <input
                    type="password"
                    placeholder="Новий пароль (від 8 символів)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Повторіть пароль"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                />
                {error && (
                    <p className="alert" role="alert">
                        {error}
                    </p>
                )}
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Зберігаємо…' : 'Змінити пароль'}
                </button>
            </form>
            <Link to="/forgot-password">Запросити нове посилання</Link>
        </div>
    );
}
