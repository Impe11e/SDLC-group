import { type SubmitEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../services/api';
import { authService } from '../services/authService';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setSubmitting(true);
        try {
            await authService.forgotPassword(email);
            setMessage(
                'Якщо такий email є в системі, ми надіслали лист із посиланням для скидання пароля (діє 30 хвилин).'
            );
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="app">
            <form onSubmit={handleSubmit}>
                <h2>Відновлення пароля</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
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
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Надсилаємо…' : 'Надіслати посилання'}
                </button>
            </form>
            <Link to="/login">← Назад до входу</Link>
        </div>
    );
}
